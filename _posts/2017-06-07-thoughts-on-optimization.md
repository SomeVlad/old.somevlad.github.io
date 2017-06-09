---
layout:     post
title:      A few thoughts on frontend optimization
date:       2017-06-07 12:00:00
summary:    There are a lot of things you can do in order to optimize client-side. But sometimes it goes wrong.
permalink:  /optimizing-frontend/
tags:       frontend optimization 
---

## Why did you write this? 

Several days ago I've stumbled upon 
[a topic](http://www.mattzeunert.com/2017/01/30/lazy-javascript-parsing-in-v8.html){:target="_blank" rel="noopener noreferrer"}
([🇷🇺](https://medium.com/devschacht/lazy-javascript-parsing-in-v8-99b5c3a6cbba){:target="_blank" rel="noopener noreferrer"})
in the internet where yet another frontend developer 
tries to &laquo;cheat the system&raquo; by outsmarting engines and compilers. 

 
The ending was a bit predictable: over 1,000 words, questionable libraries, and a bunch of hacks resulted in decreasing the load time

<br />
<br />

by 6ms 

<br />
<br />

in Chrome.

## So what?

So when you come up with yet another brilliant idea on how to cheat the compiler, first  

### 1) make sure you are smarter than this guy

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 1.5em; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/65-RbBwZQdU' frameborder='0' allowfullscreen></iframe></div>

If you think you are, proceed to the next step:

### 2) watch this video

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 1.5em; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/PhUb7y9WZGs' frameborder='0' allowfullscreen></iframe></div>

If your strategy remains unrethought 

### 3) ensure you've done all the more obvious optimization stuff

{% include optimization_checklist.html %}

<br>


### 4) You checked the hell out of this list but still haven't changed your mind?

Well...

[![I give up](/images/well.gif "I give up")](https://medium.com/new-story){:target="_blank" rel="noopener noreferrer"}

I have to end this topic somewhat arrogantly.

----------

Dixi.
