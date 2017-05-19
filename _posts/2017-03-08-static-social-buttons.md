---
layout:     post
title:      Static social share buttons
date:       2017-03-08 18:00:00
summary:    If you want to let your users share your site and don't want to load a bunch of useless SDKs, there is a way.
permalink:  /static-social-buttons/
og_image:   {{ site.url }}/images/og_static-social-buttons.png
---

### Why should it even bother me?

There are a lot of social networks now, that provide ability to share some webpage. And most of them have this feature covered in their API documentation. And [oftentimes](https://developers.facebook.com/docs/plugins/share-button) [it](https://developers.google.com/+/web/share/) [requires](https://vk.com/dev.php?method=Share) [an SDK](https://dev.twitter.com/web/tweet-button) [of that social network](https://developers.pinterest.com/docs/widgets/save/).

What you see is an easy way to add several buttons on your site.

What I see is at least 150kB of external scripts and at least 5 more requests. That's almost 2.5 times the size of the page you are viewing right now. I prefer not to even think about the time needed to execute all that scripts. As for me it's insane amount of data and time to create a couple of buttons which let users not to worry their pretty little heads about copypasting a link.

### Ok, I see... So what's the solution?

I recently discovered that the exact same thing can be accomplished much easier. What it requires is just a link with special parameters and... No, nothing else, that's it, just a link.
Create an `<a>` element with proper href attribute and you are good to go.

For Facebook (it opens a dialog that looks horrible on wide screens, so I decided it will be more correctly to open link in a popup):

```js
onclick="window.open('https://www.facebook.com/sharer/sharer.php?u={ URL you want users to share }', 'pop', 'width=600, height=400, scrollbars=no');"
```

Yep, that easy.

________________
For Twitter:

```js
href="https://twitter.com/intent/tweet?text={ text you want to appear in textbox before the url }&url={ URL you want users to share }"
```

For VK:

```js
href="https://vk.com/share.php?url={ URL }"
```

For Telegram:

```js
href="https://telegram.me/share/url?text={ Text that will appear under the link }&url={ URL }"
```

For Pinterest:

```js
href="https://pinterest.com/pin/create/button/?description={ Text for a pin }&url={ URL to share }"
```

For Skype:

```js
href="https://web.skype.com/share?url={ URL }"
```

For LinkedIn:

```js
href="http://www.linkedin.com/shareArticle?mini=true&url={ URL }&title={ Title }&summary={ Summary }"
```

Of course, it should be used with `target="_blank"`, so don't forget about [security](https://mathiasbynens.github.io/rel-noopener/).

### I smell big fat "but" waiting 'round the corner

If you prefer easier but less flexible and more data-hungry and time-wasting way over one requiring 
a little work but granting full control of your site – yes, there is one "but". 
You have to manually add icons and generate texts and URL's for sharing. 
As for me, that's not the case, because it's quite simple thing to do. And it is overweights the stupid amount 
of executable scripts, unnecessary cross-domain AJAX queries and lack of control.

So think twice.