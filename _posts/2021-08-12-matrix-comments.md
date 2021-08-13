---
title: "Matrix-powered comments on this site"
categories:
  - Misc
tags:
  - site
  - matrix
  - en
---

I have changed the commenting platform from Disqus to one based on Matrix.

There are Matrix rooms for each posts, and you can comment by either the embedded web frontend or any Matrix client. Room aliases are located above the embedded web frontend.

You can also browse all comment rooms from Matrix Space at \#comments\_xdavidwu.eglo.ga:eglo.ga

Here is the story behind this:

I had been considering about moving from Disqus to an open platfrom that statisfies following criteria:

* Accessible in some other way to those who disables JavaScript in their browsers
* Does not depend on external proprietary service
* Does not require an account just for commenting on a few sites
* Still applicable on static sites
* Still support moderation to mitigate abuses

Staticman looked like a nice choice, but it seemed to depend on source hosting platform. I was using a self-hosted GitLab instance which it supported, but I might change my hosting platform and I did not want this to be a blocker. I would like my visitors able to see new comments as soon as possible, but if I made it fully automatic with an approach that alter the site source code, when abused it can make version control history messy and also introduce high load on building systems. I preferred a solution that neither introduce source code changes nor trigger a new build of the site when comments arrive.

It turned out that my ideal solution would still inject content dynamically. To be friendly for visitors without JavaScript enabled, using `<iframe>` was the next mechanism that came to my mind. But then styling would become another problem. I would like to have my source all in one place, so the platform needs to either be configured to use style sheets from my site or have an API to update style sheets in my build process. With all these requirements it was hard to search for eligible solutions. I planned to write one by myself but more questions appeared. To prevent easy abuses, I needed to implement auth, but requiring an account for my site only was obviously a bad choice, so I might need external identity providers. Depends on specific identity providers also looked bad to me. The idea to build my own platform was put on hold.

Later, I learned about Matrix, the federated messaging protocol that supported lots of modern fancy features one would expect from an IM software. I hosted a homeserver and shared it with some friends of mine. After some frequent usage I came up with the idea of using Matrix room for comments. Federation makes it easily accessible around the world, and there is also built-in moderation feature. For visitors without JavaScript enabled, they can still find the rooms by aliases and read or leave comments with clients they like. I can also guide visitors of Gemini version of my site to comment rooms by leaving room aliases there.

To make this work, I need an embeddable web client with a simple UI and ability to view as guest. This had been in my todo (with low priority though) until I discovered [Cactus Comments](https://cactus.chat/). They had the same idea of using Matrix room for commenting platform and they already built it! But I do not like thier method for creating the rooms. If I understand the code correctly, they hook into homeserver by appservice API, and create the room when an alias that does not exists is queried. This can be abused to create many unwanted rooms and bring troubles to site owner and homeserver admin. The use of appservice API also make it harder to deploy.

So I use their web client, and create the rooms in my own way. I write a hook for the static-site generator I am using (Jekyll), and it provisions rooms when building the site. This is done under a new user, and it will invite me to become an admin in newly created room. All room creations happen automatically under my control. If interested, see `_plugins/matrix-room-provision.rb` of the site [source code](https://gitlab.eglo.ga/xdavidwu/xdavidwu.eglo.ga/-/blob/master/_plugins/matrix-room-provision.rb).

There are still many spaces for improvements, like more CSS work to make the experience more immersive to this site, and support of login mechanisms other than native username / password.
