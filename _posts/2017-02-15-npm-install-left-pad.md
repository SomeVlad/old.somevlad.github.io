---
layout:     post
title:      npm install left-pad
date:       2017-02-15 18:00:00
summary:    One more opinion on recent npmocalypse.
permalink:  /npm-install-left-pad/
tags:       npm frontend
---

## Prehistory

Web-developer Azer Koçulu, the author of 
[more than 250 node.js modules](https://gist.githubusercontent.com/azer/db27417ee84b5f34a6ea/raw/50ab7ef26dbde2d4ea52318a3590af78b2a21162/gistfile1.txt) 
was «asked» by a [Kik](http://www.kik.com/) company's lawyer to withdraw his module named 
[kik](https://github.com/hek/hek) from npm.

Programmer refused, and lawyer addressed to the NPM directly. 
Administration fulfilled his demand and replaced the kik’s owner without its author’s permission.

Azer Koçulu was very disappointed. 
He was so disappointed that he decided to «free» all his modules – more than 250 npm modules. 
There was among others a module named «left-pad» – a small module of 11 lines of code in javascript. 
It is used as a dependency in node.js, babel and in a huge amount of other modules. 
Only during last month it’s been downloaded 2,486,696 times, according to npm statistics.

There it is. What it does is simply implementing a basic left-pad string function, 
filling left part of a string with zeros and spaces:

```js
module.exports = leftpad;

function leftpad (str, len, ch) {
  str = String(str);

  var i = -1;

  if (!ch && ch !== 0) ch = ' ';

  len = len - str.length;

  while (++i < len) {
    str = ch + str;
  }

  return str;
}
````

That led to [failing an installation](https://github.com/stevemao/left-pad/issues/4) 
of modules that had left-pad as a dependency.

In order to urgently remedy the situation, CTO and co-founder of NPM Laurie Voss 
«given the severity and widespread nature of breakage» decided to 
[un-unpublish the module](https://twitter.com/seldo/status/712414588281552900).

## Community's reaction

A big part of community decided that it is a perfect time to raise 
[the problem of dependency hell](http://www.haneycodes.net/npm-left-pad-have-we-forgotten-how-to-program/) 
and say «Hey guys, that’s not acceptable to rely on such basic functionality written by someone else, 
are we programmers or what, also look, there are even worse packages, OMG, look at what we’ve become, 
let’s do something about this!»

Well, I guess, it’s not the correct angle this problem has to be observed from.

## NPM is good

First of all, npm is a great tool to save billions of hours for developers on planet Earth. 
It’s a blessing that we have option not to reinvent the wheel for every single project. 
And even if it is a basic function. Furthermore, module can contain zero lines of code and may just consist 
of useful dependencies. 
Such module can prevent you from facing unexpected problems and save you from the headache of fixing bugs.

We should be happy we have such opportunity to divide even basic functionality into modules.

Say, you have written [`isArray`](https://www.npmjs.com/package/isarray) analogue and used it in 10 projects. 
And suddenly you noticed a bug in it. You would have no option other than rewrite that function in all 10 projects.
If it is an npm-module, you can just open an issue on its [GitHub page](https://github.com/juliangruber/isarray/issues). 
That’s it.

## NPM is bad

The most worrying me thing in all this discussion is wrong emphasis. 
Rather than crying wolf at «dependency hell», we should really focus on npm’s behaviour in this situation.

Firstly, they revoked a module’s ownership without hesitation. There were no lawsuits, no claims, nothing. 
Kik just asked NPM to give them a name and NPM agreed. «Oh, hey, uhm… You guys want that name? Sure, here it is. 
The author doesn’t appreciate that? Well, screw him then».

Secondly, one single package removal may lead to failed builds across the globe and npm has no solution for that, 
which is hardly understandable, as for me.

And finally, they can do whatever they want with your code. Even when author decided to remove his package from npm, 
they just reverted removal and [didn’t feel bad about that](https://twitter.com/seldo/status/713064021797122049).

That’s what discussion should be about.

Next time I use [yarn](https://yarnpkg.com/en/).