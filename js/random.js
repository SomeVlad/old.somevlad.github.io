function jsonp(uri) {
    return new Promise(function (resolve, reject) {
        var id = '_' + Math.round(10000 * Math.random())
        var callbackName = 'jsonp_callback_' + id
        window[callbackName] = function (data) {
            delete window[callbackName]
            var ele = document.getElementById(id)
            ele.parentNode.removeChild(ele)
            resolve(data)
        }

        var src = uri + '&callback=' + callbackName
        var script = document.createElement('script')
        script.src = src
        script.id = id;
        (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
        script.addEventListener('error', reject)
    })
}

const containerNode = document.querySelector('#entries')
const entryStyleTemplate = containerNode.querySelector('#random-entry-style')

class RandomEntry extends HTMLElement {
    constructor(options, index, entriesLength) {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.style = entryStyleTemplate
        this.id = entriesLength - index;
        const attributesArray = Object.keys(options)
        attributesArray.forEach((attr) => {
            if (options[attr]) this[attr] = options[attr]
        })
        containerNode.appendChild(this)
    }

    set style(templateNode) {
        this.shadow.appendChild(document.importNode(templateNode.content, true))
    }

    set id(val) {
        const hashLink = document.createElement('a')
        hashLink.classList.add('hash-link')
        hashLink.setAttribute('href', `#${val}`)
        hashLink.textContent = '#'
        this.setAttribute('id', val)
        if (val === parseInt(window.location.hash.slice(-1))) this.classList.add('highlighted')
        this.shadow.appendChild(hashLink)
    }

    set date(val) {
        const dateNode = document.createElement('time')
        dateNode.textContent = val
        this.shadow.appendChild(dateNode)
    }

    set text(val) {
        const textNode = document.createElement('text');
        textNode.innerHTML = val;
        textNode.classList.add('centered');
        this.shadow.appendChild(textNode)
    }

    set image(val) {
        const imageNode = document.createElement('img');
        imageNode.src = val;
        const imageLinkNode = document.createElement('a');
        imageLinkNode.setAttribute('href', val)
        imageLinkNode.classList.add('image-link', 'centered')
        imageLinkNode.setAttribute('target', '_blank')
        imageLinkNode.setAttribute('rel', 'noopener noreferrer')
        imageLinkNode.appendChild(imageNode)
        this.shadow.appendChild(imageLinkNode)
    }

    set video(val) {
        const videoNode = document.createElement('div')
        videoNode.classList.add('video', 'centered')
        videoNode.innerHTML = `<div class='embed-container'><iframe src='https://www.youtube.com/embed/${val}' frameborder='0' allowfullscreen></iframe></div>`
        this.shadow.appendChild(videoNode)
    }

    set instagram(val) {
        let fetchUrl = `https://api.instagram.com/oembed?url=http://instagr.am/p/${val}/`
        const instagramPhotoNode = document.createElement('div')
        jsonp(fetchUrl).then(function (data) {
            const imageLink = data['thumbnail_url']
            const imageNode = document.createElement('img');
            imageNode.src = imageLink;
            const imageLinkNode = document.createElement('a');
            imageLinkNode.appendChild(imageNode)
            imageLinkNode.setAttribute('href', `https://www.instagram.com/p/${val}/`)
            imageLinkNode.classList.add('image-link', 'centered')
            imageLinkNode.setAttribute('target', '_blank')
            imageLinkNode.setAttribute('rel', 'noopener noreferrer')
            instagramPhotoNode.classList.add('instagram')
            instagramPhotoNode.appendChild(imageLinkNode)
        })
        this.shadow.appendChild(instagramPhotoNode)
    }

    set tweet(val) {
        let fetchUrl = `https://api.twitter.com/1/statuses/oembed.json?url=${val}`
        const tweetNode = document.createElement('div')
        tweetNode.classList.add('tweet', 'centered')
        jsonp(fetchUrl).then(function (data) {
            tweetNode.innerHTML = data.html
        })
        this.shadow.appendChild(tweetNode)
    }

    set links(arr) { // This live preview for <a href="http://en.wikipedia.org/">Wikipedia</a><div class="box"><iframe src="http://en.wikipedia.org/" width = "500px" height = "500px"></iframe></div> remains open on mouseover.

        const container = document.createElement('div')
        arr.map((link, idx) => {
            const linkNode = document.createElement('a');
            const previewBox = document.createElement('div')

            const target = link.href
            const key = '5964d5a1a1e7b4e257179772a18e4dc9cf9280e57c56c'
            const url = `http://api.linkpreview.net/?key=${key}&q=${target}`

            jsonp(url)
                .then(data => {
                    console.log(data)

                })
            linkNode.setAttribute('href', link.href)
            linkNode.setAttribute('rel', 'noopener noreferrer')
            linkNode.setAttribute('target', '_blank')
            linkNode.textContent = link.text
            linkNode.classList.add('preview-link')
            previewBox.classList.add('preview-box')
            container.classList.add('preview-container')
            linkNode.appendChild(previewBox)
            container.appendChild(linkNode)
        })
        container.classList.add('centered')
        this.shadow.appendChild(container)
    }
}

customElements.define('random-entry', RandomEntry);

const reqUrl = '/data/random.json'

fetch(reqUrl)
    .then(response => response.json())
    .then(data => data.entries.map((entry, idx) => new RandomEntry(entry, idx, data.entries.length)))
    .catch(console.log);