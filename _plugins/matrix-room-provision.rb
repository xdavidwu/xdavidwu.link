require 'net/http'
require 'json'

Jekyll::Hooks.register :site, :after_init do |site|
  $config = site.config
end

Jekyll::Hooks.register :posts, :post_write do |page|
  if $config['comments']['provider'] == 'matrix'

    Jekyll.logger.info 'Checking Matrix room for post:',  page.data['title']
    hs_url = $config['comments']['matrix']['homeserver_url']
    hs = $config['comments']['matrix']['homeserver']
    site = $config['comments']['matrix']['site']
    room_alias_local = "comments_#{site}_#{page.url}"
    room_alias = "##{room_alias_local}:#{hs}"

    alias_encoded = ERB::Util.url_encode room_alias
    alias_resolve_uri = URI hs_url + "/_matrix/client/r0/directory/room/#{alias_encoded}"
    res = Net::HTTP.get_response alias_resolve_uri

    if res.is_a? Net::HTTPNotFound
      Jekyll.logger.info 'Creating Matrix room:', room_alias
      create_room_uri = URI hs_url + '/_matrix/client/r0/createRoom'
      req = Net::HTTP::Post.new create_room_uri, 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{ENV['MATRIX_ACCESS_TOKEN']}"
      req.body = {
        visibility: 'private',
        room_alias_name: room_alias_local,
        name: "#{page.data['title']}",
        topic: "Comments of \"#{page.data['title']}\" in #{site} at #{$config['url'] + page.url}",
        invite: [$config['comments']['matrix']['admin']],
        creation_content: {
          'm.federate': true,
        },
        preset: 'public_chat',
        initial_state: [
          {
            type: 'm.room.history_visibility',
            content: {
              history_visibility: 'world_readable',
            },
          },
        ],
        power_level_content_override: {
          users: {
            $config['comments']['matrix']['admin'] => 100,
            $config['comments']['matrix']['bot'] => 100,
          },
        },
      }.to_json
      res = Net::HTTP.start create_room_uri.hostname, create_room_uri.port, use_ssl: true do |http|
        http.request req
      end
      Jekyll.logger.info "createRoom returns:", res.body
    end

    Jekyll.logger.info ""
  end
end
