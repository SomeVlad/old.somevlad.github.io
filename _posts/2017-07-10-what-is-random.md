---
layout:     post
title:      What is Яandom
date:       2017-07-10 06:00:00
summary:    What is this? What did I do that for? What's under the hood? 
permalink:  /what-is-random/
tags:       random js css DIY html-templates custom-elements
og_image:   what-is-random.png
---

You may have noticed another link appeared in the header of the site saying 
[Яandom](/random/){:target="_blank" rel="noopener noreferrer"}.

## Yeah, what is&nbsp;this?

It&nbsp;is&nbsp;basically my&nbsp;own twitter,
where&nbsp;I can share anything&nbsp;I want&nbsp;to.

## Why not use blog posts tho? 

In&nbsp;my&nbsp;head there are certain limitations for content
in&nbsp;blog posts. They are meant to&nbsp;be&nbsp;useful for anyone
googling keywords. At&nbsp;the same time there are a&nbsp;lot
of&nbsp;things&nbsp;I want to&nbsp;share, mostly with
my&nbsp;future self.

## Why not share these things on&nbsp;Twitter tho?

I&nbsp;do that, but the problem is&nbsp;that these things are spread
between social networks and messengers, and sometimes&nbsp;I find
it&nbsp;hard to&nbsp;remember where&nbsp;I saved some link and even
whether&nbsp;I did that.


So&nbsp;I&nbsp;decided to&nbsp;keep everything in&nbsp;one place:
for you to&nbsp;see and for me&nbsp;to&nbsp;find.

## Okay, so&nbsp;what&rsquo;s under the hood?

As&nbsp;always&nbsp;I decided to&nbsp;try some stuff out&nbsp;I
haven&rsquo;t used before. This time it&rsquo;s *HTML templates*
and *Custom&nbsp;elements&nbsp;v1*.

I did not come up with anything better than `.json` for keeping data.
It is structured like this:
```json
{
  "entries": [
    {
      "date": "",
      "text": "",
      "image": "",
      "tweet": "",
      "video": "",
      "instagram": ""
    },
    ...
}
```

*Custom elements* definitely have a room to grow in terms of
browser support. But let's check it out.

First we have to create new class extending `HTMLElement` and define it.
```js
const containerNode = document.querySelector('#entries')

class RandomEntry extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        // do stuff
        containerNode.appendChild(this)
    }
}

customElements.define('random-entry', RandomEntry);
```

Now let's pass fetched data to a constructor:
```js
const reqUrl = '/data/random.json'

fetch(reqUrl)
    .then(response => response.json())
    .then(data => data.entries.map((entry, idx) => new RandomEntry(entry, idx)))
    .catch(console.log);
```

I chose to not go the attributes way, because this data
is unlikely to be reused or changed. So we have data in our constructor,
and now we have to create handlers and pass them these options.
For that purposes we can `set` data.

```js
class RandomEntry extends HTMLElement {
    constructor(options, index) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.id = index;
        const attributesArray = Array.from(Object.keys(options))
        attributesArray.map((attr) => {
            if (options[attr]) this[attr] = options[attr]
        })
        containerNode.appendChild(this)
    }

    set id(val) {
        const hashLink = document.createElement('a')
        hashLink.classList.add('hash-link')
        hashLink.setAttribute('href', `#${val}`)
        hashLink.textContent = '#'
        this.setAttribute('id', val)
        this.shadow.appendChild(hashLink)
    }

    set date(val) {
        const dateNode = document.createElement('time')
        dateNode.textContent = val
        this.shadow.appendChild(dateNode)
    }

    set text(val) {
        const textNode = document.createElement('text');
        textNode.innerHTML = val;
        textNode.classList.add('centered');
        this.shadow.appendChild(textNode)
    }

```

And so on.

Now we have to style our components. Most top google search results
set styles just appending them as strings from JS. What a nonsense,
CSS-in-JS, lol.

That's obviously BS, so I created a `<template id="random-entry-style">`
element with styling inside and then imported it inside each post.
```js
// global scope
const entryStyleTemplate = containerNode.querySelector('#random-entry-style')

// RandomEntry constructor
this.style = entryStyleTemplate

// and a handler
set style(templateNode) {
    this.shadow.appendChild(document.importNode(templateNode.content, true))
}
```

Yeah, I know, I'd be better of just global styling.
But where is fun in that?

From this point it's just about proper embedding and hacking around
with JSONP to bypass CORS.

--------

Hope that was helpful.