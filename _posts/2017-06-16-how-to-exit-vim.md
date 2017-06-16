---
layout:     post
title:      How to exit vim
date:       2017-06-16 12:00:00
summary:    ↑ Click here to figure out!
permalink:  /pleeze-halp/
tags:       howto exit vim 
---

## First way

- Open another terminal tab with `cmd`/`ctrl`+`t`
- `killall -9 vim` 

## Second way

![Like this](/images/exit-vim.gif "Like this")

## Next time use nano 

If you find yourself locked inside vim only during use of `git`, consider setting `nano` 
as your default editor. 

```shell
git config --global core.editor "nano"
```

Enjoy!