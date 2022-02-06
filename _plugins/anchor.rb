class Jekyll::MarkdownHeader < Jekyll::Converters::Markdown
    def convert(content)
        super.gsub(/<h(\d) id="(.*?)">(.*)<\/h(\d)>/, '<h\1 id="\2">\3<a class="header-link" href="#\2"><span class="sr-only">Permalink</span><i class="fa fa-fw fa-link"></i></a></h\1>')
    end
end
