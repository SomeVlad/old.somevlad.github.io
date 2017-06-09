```
$ git clone git@github.com:SomeVlad/somevlad.github.io.git .
$ gem install bundler # If you don't have bundler installed
$ bundle install
$ jekyll serve --watch --drafts
$ python ./generate_tags.py
```

You can use front matter settings on each page to control how search engines will it. 
Sometimes you may want to exclude a particular page from indexing or forbid Google to store 
a copy of your page in its cache. Use the `meta_robots` frontmatter key 
and assign values based on 
[this table](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en#valid-indexing--serving-directives).

```yaml
# exclude page from index
meta_robots: noindex

# allow indexing, disallow caching
meta_robots: noarchive

# allow indexing, disallow crawling links
meta_robots: nofollow

# disallow indexing, follow links
meta_robots: noindex,follow
```


Theme: [pixyll](http://www.pixyll.com)
