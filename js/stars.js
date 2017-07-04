window.onload = () => {

    const global = {
        starsAmount: 3000,
        stars: [],
        twinklingStarsAmount: 50,
        fillTextStep: 10, // 5 for mobile
        starSizeMultiplierArray: [1 / 10, 1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1],
        backgroundColor: 'rgb(0, 0, 0)',
        opacityDelta: 0.1,
        magicWidth: 586,
        svgPathString: 'M130.4 226H24l4-18L169 53h19l-33 155.2h32.4l-3.6 17.8h-32.3l-12.2 57.4h-21l12-57.4zm-82-17.8H134l26.4-123.4-112 123.4zM324.7 50.8c11.4 0 21 1.7 28.5 5 7.6 3.5 13.7 8.2 18.3 14 4.6 6 8 13 9.7 21 2 7.8 3 16.2 3 25 0 9-.5 18.2-1.8 27.7s-3 18.7-5 27.7c-3.3 15.4-7.5 30-12.7 44.2-5.2 14-11.8 26.5-19.8 37.3-8 10.8-18 19.4-29.5 25.7C304 284.8 290 288 274 288s-28.4-3.2-37.4-9.6c-9-6.4-15-15-18.6-26-3.5-10.8-4.8-23.4-4-38 1-14.3 3-29.5 6.6-45.6 3-14.7 7-29 12-43.2 5-14 11.4-26.7 19.5-37.8 8-11 18-20 29.8-27 12-6.6 26.2-10 43-10zM357 169c2.7-12.5 4.6-24.8 5.7-36.8 1-12 .5-22.7-1.6-32.2-2-9.5-6.4-17-12.8-22.8-6.4-5.7-15.7-8.6-28-8.6-11.7 0-21.8 3-30.4 8.7-8.6 5.8-16 13.6-22.3 23.3-6.3 9.7-11.5 20.7-15.8 33-4.3 12.3-7.8 25-10.4 37.6-3 15-5 28.5-5.8 40.8-.8 12.2.2 22.6 2.8 31.2 2.6 8.6 7 15.2 13.5 20 6.4 4.7 15.2 7 26.4 7 12.5 0 23.2-3 32-9 8.8-6.3 16.3-14.2 22.4-24 6.2-9.6 11.2-20.5 15-32.6 4-12 7-24 9.5-35.6zM497.3 226H391l4-18L536 53h19l-33 155.2h32.3l-3.6 17.8h-32.3l-12.2 57.4h-21l12-57.4zm-81.8-17.8H501l26.4-123.4-112 123.4z',
        svgPath: '',
        getRandomInt: function (min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.round(Math.random() * (max - min)) + min
        },
        plusminus: function (a, b) {
            if (global.getRandomInt(0, 1) === 0) return a + b
            else return a - b
        }
    }

    class CanvasApp {
        constructor(elem) {
            this.canvas = elem
            this.ctx = this.canvas.getContext('2d')
            global.stars = []

            this.canvas.style.backgroundColor = global.backgroundColor
            this.setCanvasSize() // and generate everything
            this.listen()
            this.render()
        }

        generateText() {
            let parsedSvgPath = pathParse(global.svgPathString);
            let ratio = this.canvas.width / global.magicWidth
            let scaledSvgPath = window.scaleSvgPath(parsedSvgPath.segments, ratio)
            let path = window.pathToString(scaledSvgPath);

            global.svgPath = new Path2D(path);

            this.fillText()

        }

        fillText() {
            for (let i = 0; i < this.canvas.width; i += global.fillTextStep) {
                for (let j = 0; j < this.canvas.height; j += global.fillTextStep) {
                    if (this.ctx.isPointInPath(global.svgPath, i, j)) {
                        this.opacity = 1;
                        this.r = 1;
                        global.stars.push(new Star({
                            ctx: this.ctx,
                            x: global.plusminus(i, Math.random() * 10),
                            y: global.plusminus(j, Math.random() * 10),
                            r: 1,
                            opacity: 1
                        }));
                    }
                }
            }
        }

        setCanvasSize() {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            global.stars.length = 0
            global.fillTextStep = this.canvas.width / 90
            this.generateStars()
            this.generateText()
        }

        listen() {
            window.addEventListener('resize', this.setCanvasSize.bind(this), true)
        }

        render() {
            this.twinkle()
            requestAnimationFrame(this.render.bind(this))
        }

        twinkle() {
            for (let i = 0; i < global.twinklingStarsAmount; i++) {
                const starId = global.getRandomInt(0, global.stars.length - 1)
                const star = global.stars[starId]
                const newOpacity = global.plusminus(star.opacity, global.opacityDelta)
                global.stars[starId] = new Star({ctx: this.ctx, x: star.x, y: star.y, r: star.r, opacity: newOpacity})
            }
        }

        generateStars() {
            for (let i = 0; i < global.starsAmount; i++) {
                global.stars.push(new Star({ctx: this.ctx}))
            }
        }
    }

    class Star {
        constructor({ctx, x, y, r, opacity}) {
            this.ctx = ctx
            this.x = x || global.getRandomInt(0, this.ctx.canvas.width)
            this.y = y || global.getRandomInt(0, this.ctx.canvas.height)
            this.r = r || Math.random()
            this.opacity = opacity < 0.4 ? 0.4 : opacity > 1 ? 1 : global.getRandomInt(4, 10) / 10
            this.render()
        }

        render() {


            // if (!this.ctx || !global.svgPath) setTimeout(kek.bind(this), 1000);
            // else kek.bind(this)
            //
            // function kek() {
            //     if (this.ctx.isPointInPath(global.svgPath, this.x, this.y)) {
            //         this.opacity = 1;
            //         this.r = 1;
            //         global.stars.push(new Star({
            //             ctx: this.ctx,
            //             x: global.plusminus(this.x, 1),
            //             y: global.plusminus(this.y, 1)
            //         }));
            //     }
            // }

            const gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x + this.r, this.y + this.r, this.r * 2)
            gradient.addColorStop(0, 'rgba(255, 255, 255, ' + this.opacity + ')')
            gradient.addColorStop(1, global.backgroundColor)

            this.ctx.beginPath()
            this.ctx.clearRect(this.x - this.r - 1, this.y - this.r - 1, this.r * 2 + 2, this.r * 2 + 2);
            this.ctx.closePath()

            this.ctx.beginPath()
            this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
            this.ctx.fillStyle = gradient
            this.ctx.fill()

        }
    }

    const canvasElem = document.getElementById('stars')
    new CanvasApp(canvasElem)
}