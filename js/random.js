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
        const classes = (val === parseInt(window.location.hash.slice(-1))) ? 'highlighted hash-link' : 'hash-link'

        const hashLink = this.createElementWithProps('a', {
            classListAdd: classes,
            href: `#${val}`,
            text: '#',
            id: val
        })
        this.shadow.appendChild(hashLink)
    }

    set date(val) {
        const dateNode = this.createElementWithProps('time', {text: val})
        this.shadow.appendChild(dateNode)
    }

    set text(val) {
        const textNode = this.createElementWithProps('text', {
            innerHTML: val,
            classListAdd: 'centered'
        })
        this.shadow.appendChild(textNode)
    }

    set image(val) {
        const imageNode = this.createElementWithProps('img', {
            src: val
        })
        const imageLinkNode = this.createElementWithProps('a', {
            href: val,
            classListAdd: 'image-link centered',
            target: '_blank',
            rel: 'noopener noreferrer'
        })
        imageLinkNode.appendChild(imageNode)
        this.shadow.appendChild(imageLinkNode)
    }

    set video(val) {
        const videoNode = this.createElementWithProps('div', {
            classListAdd: 'video centered',
            innerHTML: `<div class='embed-container'><iframe src='https://www.youtube.com/embed/${val}' frameborder='0' allowfullscreen></iframe></div>`
        })
        this.shadow.appendChild(videoNode)
    }

    set instagram(val) {
        let fetchUrl = `https://api.instagram.com/oembed?url=http://instagr.am/p/${val}/`
        const instagramPhotoNode = this.createElementWithProps('div', {classListAdd: 'instagram'})
        this.jsonp(fetchUrl).then(data => {
            const imageLink = data['thumbnail_url']
            const imageNode = this.createElementWithProps('img', {src: imageLink})

            const imageLinkNode = this.createElementWithProps('a', {
                href: `https://www.instagram.com/p/${val}/`,
                classListAdd: 'image-link centered',
                target: '_blank',
                rel: 'noopener noreferrer'
            })
            imageLinkNode.appendChild(imageNode)

            instagramPhotoNode.appendChild(imageLinkNode)
        })
        this.shadow.appendChild(instagramPhotoNode)
    }

    set tweet(val) {
        let fetchUrl = `https://api.twitter.com/1/statuses/oembed.json?url=${val}`
        const tweetNode = this.createElementWithProps('div', {
            classListAdd: 'tweet centered'
        })
        this.jsonp(fetchUrl).then(function (data) {
            tweetNode.innerHTML = data.html
        })
        this.shadow.appendChild(tweetNode)
    }

    set links(arr) {
        const container = document.createElement('div')
        arr.forEach((link, idx) => {
            const linkNode = this.createElementWithProps('a', {
                href: link.href,
                target: '_blank',
                rel: 'noopener noreferrer',
                classListAdd: 'preview-link',
                text: link.text
            });
            const previewBox = this.createElementWithProps('div', {
                classListAdd: 'preview-box is-hidden'
            })

            linkNode.appendChild(previewBox)

            new MetaRetriever(link.href).getMeta
                .then(data => {
                    let type = 'wide';
                    const descriptionNode = document.createElement('div')
                    const titleNode = document.createElement('div')

                    if (data.imageSrc) {
                        const imageNode = new Image()
                        imageNode.src = data.imageSrc
                        imageNode.addEventListener("load", function () {
                            type = ((this.naturalWidth / this.naturalHeight > 1.5) ? 'wide' : 'tall')
                        });
                        previewBox.appendChild(imageNode)

                    }
                    if (data.title) {
                        titleNode.textContent = data.title
                        titleNode.classList.add('link-title')
                        previewBox.appendChild(titleNode)
                    }

                    if (data.description) {
                        descriptionNode.textContent = data.description
                        descriptionNode.classList.add('link-description')
                        previewBox.appendChild(descriptionNode)
                    }

                    previewBox.classList.add(type)
                    previewBox.classList.remove('is-hidden')
                })

            container.appendChild(linkNode)

        })
        container.classList.add('preview-container', 'centered')
        this.shadow.appendChild(container)
    }

    jsonp(uri) {
        return new Promise((resolve, reject) => {
            const id = '_' + Math.round(10000 * Math.random())
            const callbackName = 'jsonp_callback_' + id
            window[callbackName] = function (data) {
                delete window[callbackName]
                const ele = document.getElementById(id)
                ele.parentNode.removeChild(ele)
                resolve(data)
            }

            const script = this.createElementWithProps('script', {
                src: `${uri}&callback=${callbackName}`,
                id
            });
            (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
            script.addEventListener('error', reject)
        })
    }

    createElementWithProps(tagName, props) {
        return this.setProps(document.createElement(tagName), props)
    }

    setProps(node, options) {
        Object.keys(options).forEach((prop) => {
            const value = options[prop]
            switch (prop) {
                case 'text':
                    node.textContent = value
                    break;
                case 'innerHTML':
                    node.innerHTML = value
                    break;
                case 'classListAdd':
                    value.split(' ').forEach(className => node.classList.add(className))
                    break;
                case 'classListRemove':
                    value.split(' ').forEach(className => node.classList.remove(className))
                    break;
                default:
                    node.setAttribute(prop, value)
            }
        })
        return node;
    }
}

class MetaRetriever {
    constructor(url) {
        this.url = encodeURIComponent(url)
    }

    get getMeta() {
        return new Promise((resolve, reject) => {
            this.retrieveSimple(this.url)
                .then(meta => {
                    if (!meta.description || !meta.title || !meta.imageSrc) {
                        this.retrieveFromOpenGraph(this.url, meta)
                            .then(ogMeta => resolve(ogMeta))
                    }
                    else resolve(meta)
                })
        })
    }

    retrieveFromOpenGraph(url, parsedMeta) {
        const app_id = '5965421a07efcb0b00a6d42d'
        const urlToFetch = `https://opengraph.io/api/1.1/site/${url}?app_id=${app_id}`

        return fetch(urlToFetch)
            .then(response => response.json())
            .then(data => {
                const propsArray = Object.keys(data)
                // if (!propsArray.includes('error')) {
                    return {
                        imageSrc: parsedMeta.imageSrc || (!data.openGraph.error && data.openGraph.image.url) ||
                        (!data.hybridGraph.error && data.hybridGraph.image) ||
                        (!data.htmlInferred.error && data.htmlInferred.image_guess) || "",
                        title: parsedMeta.title || data.openGraph.title || data.hybridGraph.title || data.htmlInferred.title || "",
                        description: parsedMeta.description || data.openGraph.description ||
                        data.hybridGraph.description || data.htmlInferred.description || ""
                    }
                // }
            })
    }

    retrieveSimple(url) {
        const fetchUrl = `https://82.196.4.230:1488/?url=${url}`
        return fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                return {
                    imageSrc: data.ogImage || data.twitterImageSrc || "",
                    title: data.ogTitle || data.title || "",
                    description: data.ogDescription || data.twitterDescription || data.description || ""
                }
            })

    }
}

customElements.define('random-entry', RandomEntry);

const reqUrl = '/data/random.json'

fetch(reqUrl)
    .then(response => response.json())
    .then(data => data.entries.map((entry, idx) => new RandomEntry(entry, idx, data.entries.length)))
    .catch(console.error);