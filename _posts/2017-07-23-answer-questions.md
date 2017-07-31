---
layout:     post
title:      Several typical js tasks – pt. I
date:       2017-07-31 06:00:00
summary:    Maybe one day this post will save me some time on an interview.
permalink:  /answers/
tags:       js frontend
og_image:   answers.png
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

Wandering around the internet I've stumbled upon another
["list of things each frontender should know"](https://performancejs.com/post/hde6d32/The-Best-List-of-Frontend-JavaScript-Interview-Questions-(written-by-a-Frontend-Engineer)){:target="_blank" rel="noopener noreferrer"}.
At first I wanted to write a topic with my opinion on such lists,
but then I decided not to do that, and just complete the coding
tasks instead. Most of them I've already seen while passing interviews, and I
thought it would be handy to have it all done at once
so I have my code samples on hand.

Also, feel free to edit parameters, but remember:
don't exceed the maximum call stack size! ☝️😦

Let's go.

### Implement the following functions:

1. `isPrime` - returns `true` or `false`, indicating whether the given
number is prime.

    ```js
    function isPrime(num) {
        if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
        if (num > Number.MAX_SAFE_INTEGER) return new Error('Too big value')

        // all primes are of the form 6k ± 1, with the exception of 2 and 3
        // so we only need to test if n is divisible by 2 or 3
        // then to check through all the numbers of form 6k ± 1 < √n
        if (num < 3) return num === 2
        if (num % 2 === 0 || num % 3 === 0) return false

        for (let i = 5; i * i < num; i += 6) {
            if (num % i === 0) return false
        }
        return true
    }
    ```

    isPrime(<span contenteditable='true' class='isPrime' edit>5</span>)<span class='result isPrime' />

1. `factorial` - returns a number that is the factorial of the given number.

    ```js
    function (num) {
        if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
        return (num !== 1) ? num * this.factorial(num - 1) : 1
    }
    ```

    factorial(<span contenteditable='true' class='factorial' edit>5</span>)<span class='result factorial' />

1. `fib` - returns the nth Fibonacci number.

    ```js
    // with a simple memoization
    function (num) {
        if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
        if (!this.cache) this.cache = {}
        if (!this.cache[num]) this.cache[num] = num < 3 ? 1 : this.fib(num - 1) + this.fib(num - 2)
        return this.cache[num]
    }
    ```

    fib(<span contenteditable='true' class='fib' edit>5</span>)<span class='result fib' />

1. `isSorted` - returns `true` or `false`, indicating whether the given array of numbers is sorted.

    ```js
    function (array) {
        // Infinity and NaN won't work because of JSON.parse
        // if there is no parsing involved everything will be ok
        if (!Array.isArray(array)) return new Error('Not an array')
        const length = array.length
        if (length > 1) {
            // "sorted" means ascending order, I guess
            for (let i = 0; i < length - 1; i++) {
                if (array[i] > array[i + 1]) return false
            }
        }
        return true
    }
    ```

    isSorted([<span contenteditable='true' class='isSorted' edit>3, 2, 1</span>])<span class='result isSorted' />

1. `filter` - implement the `filter` function.

    ```js
    function (array,callback) {
        if (!Array.isArray(array)) return new Error('Not an array')
        const newArray = []
        for (let i of array) {
            if (callback(i)) newArray.push(i)
        }
        return newArray
    }
    ```

     filter([<span contenteditable='true' class='filter' edit>1, 2, 3, 4</span>], n => n < 3)<span class='result filter' />

1. `reduce` - implement the `reduce` function.

    Nah.

1. `reverse` - reverses the given string (yes, using the built in `reverse` function is cheating).

    ```js
    function (str) {
        if (typeof str !== 'string' || str.length === 0) return new Error('Bad input')
        return Array.from(str).reduce((prev, curr) => curr + prev)
    }
    ```

     reverse("<span contenteditable='true' class='reverse' edit>lorem ipsum</span>")<span class='result reverse' />

1. `indexOf` - implement the `indexOf` function for arrays.

    ```js
    function (str) {
        if (!Array.isArray(array)) return new Error('Not an array')
        for (let i = 0; i < array.length; i++) {
            if (array[i] === elementToFind) return i
        }
        return -1
    }
    ```

     indexOf([<span contenteditable='true' class='indexOf' edit>1, 2, 3, 4</span>], 3)<span class='result indexOf' />

1. `isPalindrome` - return `true` or `false` indicating whether the given string is a palindrome (case and space insensitive).

    ```js
    function (str) {
        if (typeof str !== 'string') return new Error('Bad input')
        const formattedString = str.toLowerCase().replace(/\s/g, '')
        return formattedString === Array.from(formattedString).reverse().join('')
    }
    ```

     isPalindrome("<span contenteditable='true' class='isPalindrome' edit>A man a plan a canal Panama</span>")<span class='result isPalindrome' />

1. `missing` - takes an unsorted array of unique numbers (ie. no repeats) from 1 through some number n, and returns the missing number in the sequence (there are either no missing numbers, or exactly one missing number).
Can you do it in O(N) time? Hint: There’s a clever formula you can use.

    ```js
    function (array) {
        if (!Array.isArray(array)) return new Error('Not an array')
        let min = Math.min.apply(Math, array)
        const max = Math.max.apply(Math, array)
        for (min; min < max; min++) {
            if (array.indexOf(min) === -1) return min
        }
    }
    ```

    missing([<span contenteditable='true' class='missing' edit>5, 3, 1, 2</span>])<span class='result missing' />

1. `isBalanced` - takes a string and returns `true` or `false` indicating whether its curly braces are balanced.

    I will take it one step further: for `{}`, `[]` and `()`.

    ```js
    function (str) {
        if (typeof str !== 'string') return new Error('Bad input')
        str = str.replace(/[^(){}\[\]]+/g, '')
        const conformity = {
            '(': ')',
            '{': '}',
            '[': ']'
        }

        if (str.length === 0) return true
        if (str.length % 2 !== 0) return false
        const stack = []

        for (let i = 0; i < str.length; i++) {
            // if a char is an opening bracket
            if (str[i] in conformity) {
                // then put it into stack
                stack.push(str[i])
            }
            // if a char is a closing bracket
            // then pull the last opening bracket
            // and check if it's corresponding to the current char
            else if (conformity[stack.pop()] !== str[i]) return false
        }

        // stack is empty – all good
        // and vice versa
        return stack.length === 0
    }
    ```

     isBalanced("<span contenteditable='true' class='isBalanced' edit>foo[bar{baz}boo]{quux}{norf()}</span>")<span class='result isBalanced' />



-----------------
More complicated tasks are coming up.