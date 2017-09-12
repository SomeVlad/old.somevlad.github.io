---
layout:     post
title:      Several typical js tasks – pt. II
date:       2017-09-03 06:00:00
summary:    Maybe one day this post will save me even more time on an interview.
permalink:  /more-answers/
tags:       js frontend
og_image:   more-answers.png
---

<script src='/js/tests.js' defer></script>
<style>
    span.result:before {
        content: '==';
        margin: 0 5px;
    }
    span[contenteditable] {
        color: firebrick;
        position: relative;
    }
    span[edit]:after {
        content: '👆 ✍️';
        position: absolute;
        width: 3em;
        bottom: -1.4em;
        left: -0.1em;
        font-size: 0.8em;
    }
</style>

This is the second part (first is [here](/answers/)) of things "each frontender should know"
according to [this](https://performancejs.com/post/hde6d32/The-Best-List-of-Frontend-JavaScript-Interview-Questions-(written-by-a-Frontend-Engineer)){:target="_blank" rel="noopener noreferrer"} topic.

![Shitty whiteboard questions](/images/og/more-answers.png)

I'm kinda lazy to do the last two tasks, and syndrome of incomplete action
`const`antly doesn't `let` me sleep at night `for` a `while`, so I decided to publish all I've got
at this moment. Enjoy.

### Implement the following functions:

1. `fib2` - like the `fib` function you implemented above, able to handle numbers up to 50 (hint: look up memoization).

    [Done already](/answers/).

1. `isBalanced2` - like the `isBalanced` function you implemented above, but supports 3 types of braces: curly `{}`, square `[]`, and round `()`. A string with interleaving braces should return `false`.

    [Done already](/answers/).

1. `uniq` - takes an array of numbers, and returns the unique numbers. Can you do it in O(N) time?

    ```js
    function (array) {
        if (!Array.isArray(array)) return new Error('Not an array')
        return Array.from(new Set(array))
    }
    ```

    uniq([<span contenteditable='true' class='uniq' edit>3, 3, 2, 2, 1</span>])<span class='result uniq' />

1. `intersection` – find the intersection of two arrays. Can you do it in O(M+N) time (where M and N are the lengths of the two arrays)?

    Yes, I can. I guess.

    ```js
    function (firstArray, secondArray) {
        // first find `uniq` numbers in both arrays
        const uniqFirst = this.uniq(firstArray)
        const uniqSecond = this.uniq(secondArray)

        // and return filtered array of elements found in both arrays
        return uniqFirst.length < uniqSecond.length ?
            uniqFirst.filter(num => uniqSecond.includes(num)) :
            uniqSecond.filter(num => uniqFirst.includes(num))
    }
    ```

    intersection([<span contenteditable='true' class='intersection' edit>3, 2, 1, 900</span>], [900, 3, 7, 4])<span class='result intersection' />


1. `sort` - implement the sort function to sort an array of numbers in `O(N×log(N))` time.

    Just a merge sort. I stole it. And [removed semicolons](/semicolon/).
    ```js
    function (array) {
        // Infinity and NaN won't work because of JSON.parse
        // and I'm too lazy to fix it now.
        // If there is no parsing involved everything will be ok
        if (!Array.isArray(array)) return new Error('Not an array')

        function merge(listR, listL) {
            const output = []
            while (listL.length && listR.length) {
                listL[0] < listR[0] ? output.push(listL.shift()) : output.push(listR.shift())
            }
            return output.concat(listL).concat(listR)
        }

        if (array.length < 2) {
            return array;
        }

        const pivot = Math.floor(array.length / 2)
        const listL = array.slice(0, pivot)
        const listR = array.slice(pivot)

        return merge(this.sort(listL), this.sort(listR))
    }
    ```

    sort([<span contenteditable='true' class='sort' edit>3, 2, 1</span>])<span class='result sort' />

1. `includes` - return `true` or `false` indicating whether the given number appears in the given sorted array. Can you do it in `O(log(N))` time?

    Let's apply divide and conquer paradigm.
    1. We can do dichotomous division of an initial array,
    1. compare the middle element with the number we search for and then
    1. repeat the procedure with the correct subarray

    Binary search basically.

    ```js
    function (array, number) {
        if (!Array.isArray(array)) return new Error('Not an array')
        if (array.length < 2) return array[0] === number

        let low = 0
        let high = array.length - 1
        while (low <= high) {
            if (high === low) return array[low] === number
            const guessedIndex = Math.floor((low + high) / 2)
            if (array[guessedIndex] === number) return true
            array[guessedIndex] > number ? high = guessedIndex - 1 : low = guessedIndex + 1
        }
    }
    ```

    includes([<span contenteditable='true' class='includes' edit>1, 2, 3, 8, 9, 14, 88, 1861</span>], 9)<span class='result includes' />

1. `assignDeep` - like `Object.assign`, but merges objects deeply. For the sake of simplicity, you can assume that objects can contain only numbers and other objects (and not arrays, functions, etc.).

    ```js
    function (target, ...sources) {
        // check if nothing left to merge the target with
        if (!sources.length) return target

        // take first source from sources...
        const source = sources.shift()

        // ...and for each of its keys...
        Object.keys(source).map(key => {
            // ...if this key is an object...
            if (isObject(source[key])) {
                // ...put this key if there is no such key in the target object
                // and merge these two objects deeply
                if (!target[key]) Object.assign(target, {[key]: {}})
                this.assignDeep(target[key], source[key])
            // if this key is not an object
            } else {
                // just merge them the simple way
                Object.assign(target, {[key]: source[key]})
            }
        })

        // then repeat procedure with all the remaining sources
        return this.assignDeep(target, ...sources)

        function isObject(item) {
            return (item && typeof item === 'object');
        }
    }
    ```

    Check your console to see how it works.

----------------
More complicated tasks are coming up. Maybe.