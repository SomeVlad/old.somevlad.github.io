{
    const tests = {
        isPrime: function (num) {
            num = +num
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
        },

        factorial: function (num) {
            num = +num
            if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
            return (num !== 1) ? num * this.factorial(num - 1) : 1
        },

        fib: function (num) {
            num = +num
            // with a simple memoization
            if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
            if (!this.cache) this.cache = {}
            if (!this.cache[num]) this.cache[num] = num < 3 ? 1 : this.fib(num - 1) + this.fib(num - 2)
            return this.cache[num]
        },

        isSorted: function (array) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                new Error('Bad input')
            }

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
        },

        filter: function (array, callback = n => n < 3) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            const newArray = []
            for (let i of array) {
                if (callback(i)) newArray.push(i)
            }
            return newArray
        },

        reduce: function (array, callback = (a, b) => a + b, accumulator = 0) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            if (array.length === 0) return accumulator

            // if there is anything to reduce, pass the reduce function an array without first element,
            // a callback, and new accumulator which is the result of a callback function with
            // initial accumulator and a first element of an array
            else return this.reduce(array.slice(1), callback, callback(accumulator, array[0]))
        },

        reverse: function (str) {
            if (typeof str !== 'string' || str.length === 0) return new Error('Bad input')
            return Array.from(str).reduce((prev, curr) => curr + prev)
        },

        indexOf: function (array, elementToFind = 3) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            for (let i = 0; i < array.length; i++) {
                if (array[i] === elementToFind) return i
            }

            return -1
        },

        isPalindrome: function (str) {
            if (typeof str !== 'string') return new Error('Bad input')
            const formattedString = str.toLowerCase().replace(/\s/g, '')
            return formattedString === Array.from(formattedString).reverse().join('')
        },

        missing: function (array) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')
            let min = Math.min.apply(Math, array)
            const max = Math.max.apply(Math, array)
            for (min; min < max; min++) {
                if (array.indexOf(min) === -1) return min
            }
        },

        isBalanced: function (str) {
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
        },

        uniq: function (array) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            return Array.from(new Set(array))
        },

        intersection: function (firstArray, secondArray = [900, 3, 7, 4]) {
            try {
                firstArray = JSON.parse(`[ ${firstArray} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(firstArray)) return new Error('Not an array')

            // first find `uniq` numbers in both arrays
            const uniqFirst = this.uniq(firstArray)
            const uniqSecond = this.uniq(secondArray)

            // and return filtered array of elements found in both arrays
            return uniqFirst.length < uniqSecond.length ?
                uniqFirst.filter(num => uniqSecond.includes(num)) :
                uniqSecond.filter(num => uniqFirst.includes(num))
        },

        sort: function (array) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            function merge(listR, listL) {
                const output = []
                while (listL.length && listR.length) {
                    listL[0] < listR[0] ? output.push(listL.shift()) : output.push(listR.shift())
                }
                return output.concat(listL).concat(listR)
            }

            if (array.length < 2) return array

            const pivot = Math.floor(array.length / 2)
            const listL = array.slice(0, pivot)
            const listR = array.slice(pivot)

            return merge(this.sort(listL), this.sort(listR))
        },

        includes: function (array, number = 9) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            } catch (error) {
                return new Error('Bad input')
            }
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
        },

        assignDeep: function (target, ...sources) {
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
    }

    const calculate = (input) => {
        const testName = input.className
        if (testName === 'site') return
        const value = input.textContent
        const resultNode = document.querySelector(`span.result.${testName}`)
        resultNode.textContent = tests[testName](value)
    }

    // calculate with initial values
    Array.from(document.querySelectorAll('span[contenteditable="true"]')).forEach(input => calculate(input))

    // remove hints on click
    document.addEventListener('click', (event) => {
        if (event.target.hasAttribute('edit')) document.querySelectorAll('[edit]').forEach(div => div.removeAttribute('edit'))
    })

    // recalculate on change
    document.addEventListener('keyup', (event) => {
        if (event.target.contentEditable) {
            calculate(event.target)
        }
    })

    const expandedLog = obj => JSON.stringify(obj, true, 2)

    // assignDeep showcase
    console.log('______deep merge______')
    const target = {a: {b: {c: 1}}}
    const sourceOne = {a: {b: {d: 2}}, e: 3}
    const sourceTwo = {a: {b: {f: 4}}, e: 3}
    console.log(`target is ${expandedLog(target)}\n
first source is ${expandedLog(sourceOne)} \n
second source is ${expandedLog(sourceTwo)} \n\n
result is ${expandedLog(tests.assignDeep(target, sourceOne, sourceTwo))}`)
}

