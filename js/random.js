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
        const attributesArray = Array.from(Object.keys(options))
        attributesArray.map((attr) => {
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
        jsonp(fetchUrl, true).then(function (data) {
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
}

customElements.define('random-entry', RandomEntry);

const reqUrl = '/data/random.json'

fetch(reqUrl)
    .then(response => response.json())
    .then(data => data.entries.map((entry, idx) => new RandomEntry(entry, idx, data.entries.length)))
    .catch(console.log);