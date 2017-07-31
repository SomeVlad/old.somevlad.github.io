(function () {
    const tests = {
        isPrime: function (num) {
            num = +num
            if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
            if (num > Number.MAX_SAFE_INTEGER) return new Error('Too big value')
            if (num < 3) return num === 2
            if (num % 2 === 0 || num % 3 === 0) return false

            for (let i = 5; i * i < num; i += 6) {
                if (num % i === 0)
                    return false
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
            if (!Number.isInteger(num) || num < 1) return new Error('Not a positive integer')
            if (!this.cache) this.cache = {}
            if (!this.cache[num]) this.cache[num] = num < 3 ? 1 : this.fib(num - 1) + this.fib(num - 2)
            return this.cache[num]
        },

        isSorted: function (array) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            }
            catch (error) {
                new Error('Bad input')
            }

            if (!Array.isArray(array)) return new Error('Not an array')
            const length = array.length
            if (length > 1) {
                for (let i = 0; i < length - 1; i++) {
                    if (array[i] > array[i + 1]) {
                        return false
                    }
                }
            }
            return true
        },

        filter: function (array, callback = n => n < 3) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            }
            catch (error) {
                return new Error('Bad input')
            }
            if (!Array.isArray(array)) return new Error('Not an array')

            const newArray = []
            for (let i of array) {
                if (callback(i)) newArray.push(i)
            }
            return newArray
        },

        reverse: function (str) {
            if (typeof str !== 'string' || str.length === 0) return new Error('Bad input')
            return Array.from(str).reduce((prev, curr) => curr + prev)
        },

        indexOf: function (array, elementToFind = 3) {
            try {
                array = JSON.parse(`[ ${array} ]`)
            }
            catch (error) {
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
            }
            catch (error) {
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
            if (str.length % 2 > 0) return false
            const stack = []

            for (let i = 0; i < str.length; i++) {
                if (str[i] in conformity) {
                    stack.push(str[i])
                }
                else if (Object.values(conformity).includes(str[i]) && stack.length > 0) {
                    if (conformity[stack.pop()] !== str[i]) return false
                }
                else return false
            }

            return stack.length === 0
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
})()