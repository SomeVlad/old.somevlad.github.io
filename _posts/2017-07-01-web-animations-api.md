---
layout:     post
title:      "In a nutshell: Web Animations API"
date:       2017-07-01 12:00:00
summary:    What is this? Is it better than CSS animations?
permalink:  /in-a-nutshell-web-animations-api/
tags:       in-a-nutshell web-animations js css
og_image:   in-a-nutshell-web-animations-api.png
---

[What is *in a nutshell*](/tag/in-a-nutshell/){:target="_blank" rel="noopener noreferrer"}

1. Web Animations API is a native API for animations in JavaScript.
1. Syntax is pretty close to jQuery's `.animate()`: 
```js 
const element = document.querySelector('.animate-me');
element.animate(keyframes, options);
```
1. `keyframes` is an array of objects, representing frames. 
1. Syntax is similar to `keyframes` from CSS. *kebab-case* must be converted to *lowerCamelCase*.
```js
const keyframes = [
    { 
        transform: 'translateY(-1000px) scaleY(2.5) scaleX(.2)', 
        transformOrigin: '50% 0', 
        filter: 'blur(40px)', 
        opacity: 0 
    },
    { 
        transform: 'translateY(0) scaleY(1) scaleX(1)',
        transformOrigin: '50% 50%',
        filter: 'blur(0)',
        opacity: 1 
    }
];
```
1. `options` is an object containing, well, options:
```js
const options = {
    iterations: Infinity, // number of iterations, animation-iteration-count
    iterationStart: 0, // first iteration, may be decimal
    delay: 0, // delay 
    endDelay: 0, // delay between animations 
    direction: 'alternate', // animation-direction basically 
    duration: 700, // duration in ms
    fill: 'forwards', // animation-fill-mode
    easing: 'ease-out', // default is `linear` instead of `ease` in CSS (animation-timing-function)
}
```
1. You don't have to use `will-change` with it.
1. With Web Animations API we can easily manipulate animations.
```js
element.getAnimations() // returns an array of animations or transitions applied to our element using CSS or WAAPI
        .map((animation) => {
            animation.pause()
            animation.play();
            animation.playbackRate = 2; // speed it up
            animation.playbackRate = .4; // use a number less than one to slow it down
            // events
            animation.onfinish = function() {
              element.remove();
            }
            // and promises
            animation.finished.then(() =>
              element.remove())
        })
```

--------
Now go and try it out!