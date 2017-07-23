---
layout:     post
title:      The Answer to The Ultimate Question of Life, the Universe, and Everything
date:       2017-07-20 06:00:00
summary:    As I always say, the title is self-explanatory.
permalink:  /semicolon/
tags:       js frontend
og_image:   semicolon.png
---

There is an often-raised question in javascript community:
should we add semicolon to terminate each statement in C-like manner,
or should we abandon them like an anachronism and never look back.

For decades best minds struggled to find
the ultimate answer for this question. To&nbsp;no&nbsp;awail.

But today I'm going to introduce to you **THE ULTIMATE ANSWER**.

Please take a seat.


Are you ready?

<br>
<br>
<br>
<br>
<br>

The truth about semicolons is that...

<br>
<br>
<br>
<br>
<br>

<span class='h1'>THERE IS NO FREAKING DIFFERENCE</span>

Like... At all.

![Same](/images/same.gif "Same")

Seriously. Just pick an option that is ok in your team and stick with it.

## But there is a problem

As far as I can tell from my experience there is a common
misconception about so-called ASI --- automatic semicolon insertion ---
in javascript.

Some people tend to think it may cause errors in a javascript code.

![Fake news](/images/fake-news.jpg "Fake news")

Where do these statements come from?

<span class='h1'>Ignorance</span>

[This talk](https://www.destroyallsoftware.com/talks/wat){:target="_blank" rel="noopener noreferrer"},
for example. All of this derived from lack of understanding
how javascript actually works. How does plus operator work,
how its type conversion works, what is `ToPrimitive`, how parser and
interpreter analyze code.

Or those 'true programmers' who decide
[javascript is a bad language](https://www.google.ru/search?q=javascript+sucks){:target="_blank" rel="noopener noreferrer"}
after 15&nbsp;minutes of trying to understand closures.

To sum up, some people afraid of ASI just because they don't understand
how it works. It's ok, because we are still animals and it is
evolutionarily justified to be afraid of something we don't know.

But I wish all programmers were a little bit more conscious than a monkey and could
overcome their inner animal.

-------

I guess, you have rested from the shock of the **THE&nbsp;ULTIMATE&nbsp;ANSWER**,
so here is another revelation:

<span class='h1'>THERE IS ONLY ONE CASE WHEN YOU REALLY NEED SEMICOLON</span>

![Shock](/images/shock.gif "Shock")

That's right. In front of brackets.

1.1 If a line starts with round brackets:
```js
const a = 'a semicolon maybe?'
const q = 'what am I missing? ' + a
(function() {
    // ...
})()

// a is not a function
```

1.2 If a line starts with square brackets:
 ```js
 const reactions = {wat: '? 🤔'}
 ['Why', 'would', 'you', 'ever', 'do', 'that'].join(' ') + reactions.wat

 // Cannot read property 'join' of undefined
 ```

To avoid that you can actually just prepend this line with semicolon.

-----------------
So my idea basically: <br>
do not be afraid of something you don’t know.<br>
Find out about it. <br>
You are an engineer, not an animal.