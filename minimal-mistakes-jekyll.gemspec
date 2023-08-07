# coding: utf-8

Gem::Specification.new do |spec|
  spec.name                    = "minimal-mistakes-jekyll"
  spec.version                 = "4.20.2"
  spec.authors                 = ["Michael Rose"]

  spec.summary                 = %q{A flexible two-column Jekyll theme.}
  spec.homepage                = "https://github.com/mmistakes/minimal-mistakes"
  spec.license                 = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files                   = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^(assets|_(data|includes|layouts|sass)/|(LICENSE|README|CHANGELOG)((\.(txt|md|markdown)|$)))}i)
  end

  spec.add_runtime_dependency "jekyll", ">= 4.1", "< 5.0"
  spec.add_runtime_dependency "jekyll-sass-converter", ">= 2.0", "< 3.0"
  spec.add_runtime_dependency "jekyll-sitemap", ">= 1.3"
  spec.add_runtime_dependency "jekyll-feed", ">= 0.1"
  spec.add_runtime_dependency "jekyll-include-cache", ">= 0.1"
  spec.add_runtime_dependency "jekyll-tidy"
  spec.add_runtime_dependency "classifier-reborn"
  spec.add_runtime_dependency "matrix"

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake", ">= 12.3.3"
end
