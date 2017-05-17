---
layout:     post
title:      Making cross-browser «copy to clipboard» button
date:       2016-12-17 18:00:00
summary:    Problems you might have encountered if you ever tried to use execCommand().
categories: 
---

It's been [a while](https://w3c.github.io/editing/execCommand.html) since execCommand() got "Unofficial Draft" status, and it has basic support in Chrome, so it's already time to test it. (I mean, it's 2016, right?)  
This function provides us among other with an ability to put stuff into clipboard with "copy" parameter. So what we [should do](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands) step by step in order to make a "copy to clipboard button":

*   Well, make a button and assign a click listener to it
*   Have visible node with a text to copy
*   Create a [Range object](https://developer.mozilla.org/en-US/docs/Web/API/Range)
*   Call `selectNode()` function on that range and pass a node we want to copy to it
*   Tell browser to get selection
*   Ask browser to copy that
*   Remove all the selections we created

That seems pretty simple and should be working [in some browsers](http://caniuse.com/#feat=clipboard). Well, it does. In Firefox 50\.  
Safari 10.0.1 can't execute execCommand(). And at first I haven't found a workaround.  
Chrome 55 returned a mysterious error: "Discontiguous selection is not supported". At this point I have no idea why is it discontiguous. But this bug seems to be there [for a long time](https://groups.google.com/a/chromium.org/forum/#!topic/chromium-bugs/o8yMnFl7LAs).  

So what should we do? Well, if Chrome thinks there is a some kind of "discontiguousness" happening, maybe we should clear all selections first, to tell him there is only one contiguous selection? So I just tried to call this function before all that copying shenanigans start:

```
function clearSelection() {
    if (document.selection) {
         document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}` 
```

And it worked! So the whole "copy to clipboard" logic looks like this:

```
let copyEmailBtn = document.querySelector('.copyToClipboardBtn');
document.queryCommandSupported('copy') ?
    (copyEmailBtn.addEventListener('click', (event) => {
        clearSelection();
        let emailLink = document.querySelector('.emailLink');
        let range = document.createRange();
        range.selectNode(emailLink);
        window.getSelection().addRange(range);

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'copied' : 'not_copied';
            copyEmailBtn.classList.add(msg);
        } catch (err) {}
        clearSelection();
    }))
    : copyEmailBtn.classList.add('disabled');

function clearSelection() {
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}
```

Working in Edge, Chrome 55, Firefox 50, and also that fixed Safari 10.0.1's inability to make `execCommand('copy')`, so there it's working to.