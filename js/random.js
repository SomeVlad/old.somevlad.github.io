function jsonp(uri) {
    return new Promise(function (resolve, reject) {
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

function createElementWithProps(tagName, props) {
    return setProps(document.createElement(tagName), props)
}

function setProps(node, options) {
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

        const hashLink = createElementWithProps('a', {
            classListAdd: classes,
            href: `#${val}`,
            text: '#',
            id: val
        })
        this.shadow.appendChild(hashLink)
    }

    set date(val) {
        const dateNode = createElementWithProps('time', {text: val})
        this.shadow.appendChild(dateNode)
    }

    set text(val) {
        const textNode = createElementWithProps('text', {
            innerHTML: val,
            classListAdd: 'centered'
        })
        this.shadow.appendChild(textNode)
    }

    set image(val) {
        const imageNode = createElementWithProps('img', {
            src: val
        })
        const imageLinkNode = createElementWithProps('a', {
            href: val,
            classListAdd: 'image-link centered',
            target: '_blank',
            rel: 'noopener noreferrer'
        })
        imageLinkNode.appendChild(imageNode)
        this.shadow.appendChild(imageLinkNode)
    }

    set video(val) {
        const videoNode = createElementWithProps('div', {
            classListAdd: 'video centered',
            innerHTML: `<div class='embed-container'><iframe src='https://www.youtube.com/embed/${val}' frameborder='0' allowfullscreen></iframe></div>`
        })
        this.shadow.appendChild(videoNode)
    }

    set instagram(val) {
        let fetchUrl = `https://api.instagram.com/oembed?url=http://instagr.am/p/${val}/`
        const instagramPhotoNode = createElementWithProps('div', {classListAdd: 'instagram'})
        jsonp(fetchUrl).then(data => {
            const imageLink = data['thumbnail_url']
            const imageNode = createElementWithProps('img', {src: imageLink})

            const imageLinkNode = createElementWithProps('a', {
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
        const tweetNode = createElementWithProps('div', {
            classListAdd: 'tweet centered'
        })
        jsonp(fetchUrl).then(function (data) {
            tweetNode.innerHTML = data.html
        })
        this.shadow.appendChild(tweetNode)
    }





    set links(arr) {

        const container = document.createElement('div')

        arr.forEach((link, idx) => {
            const linkNode = createElementWithProps('a', {
                href: link.href,
                target: '_blank',
                rel: 'noopener noreferrer',
                classListAdd: 'preview-link',
                text: link.text
            });
            const previewBox = createElementWithProps('div', {
                classListAdd: 'preview-box is-hidden'
            })

            linkNode.appendChild(previewBox)

            const app_id = '5965421a07efcb0b00a6d42d'
            const ogurl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(link.href)}?app_id=${app_id}`
            fetch(ogurl)
                .then(response => response.json())
                .then(data => {
                    let type = '';
                    const descriptionNode = document.createElement('div')
                    const titleNode = document.createElement('div')

                    const propsArray = Object.keys(data)
                    if (!propsArray.includes('error')) {
                        const imageSrc = data.openGraph.image.url || data.hybridGraph.image || data.htmlInferred.image_guess || ""
                        const title = data.openGraph.title || data.hybridGraph.title || data.htmlInferred.title || ""
                        const description = data.openGraph.description || data.hybridGraph.description || data.htmlInferred.description || ""

                        if (imageSrc) {
                            const imageNode = new Image()
                            imageNode.src = imageSrc
                            imageNode.addEventListener("load", function () {
                                type = ((this.naturalWidth / this.naturalHeight > 1.5) ? 'wide' : 'tall')
                                previewBox.classList.add(type)
                            });
                            previewBox.appendChild(imageNode)

                        }
                        if (title) {
                            titleNode.textContent = title
                            titleNode.classList.add('link-title')
                            previewBox.appendChild(titleNode)
                        }

                        if (description) {
                            descriptionNode.textContent = description
                            descriptionNode.classList.add('link-description')
                            previewBox.appendChild(descriptionNode)
                        }


                        previewBox.classList.remove('is-hidden')
                    }
                })

            container.appendChild(linkNode)

        })
        container.classList.add('preview-container', 'centered')
        this.shadow.appendChild(container)
    }
}

customElements.define('random-entry', RandomEntry);

const reqUrl = '/data/random.json'

fetch(reqUrl)
    .then(response => response.json())
    .then(data => data.entries.map((entry, idx) => new RandomEntry(entry, idx, data.entries.length)))
    .catch(console.log);