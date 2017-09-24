import React, { Component } from 'react'
import LanguageSwitcher from 'LanguageSwitcher'
import './App.css'

class App extends Component {
    static defaultProps = {
        locales: ['en', 'ru']
    }

    state = {
        locale: this.props.locales[0]
    }

    componentWillMount() {
        this.props.locales.forEach(locale => {
            fetch(`/cv/src/locales/${locale}.json`)
                .then(response => response.json())
                .then(data => this.setState({ [locale]: data }))
        })
    }

    render() {
        const lang = this.state[this.state.locale] || {}
        const {
            name = '',
            position = '',
            address = ''
        } = lang

        return (
            <div className="cv">
                <LanguageSwitcher locales={this.props.locales} onClickHandler={() => this.setState({locale: 'en'})}/>
                <div className="cv-header">
                    <h1>{position}</h1>
                    <h2>{name}</h2>
                    <address>{address}</address>
                </div>
                <p className="cv-intro" onClick={() => this.setState({ locale: 'ru' })}>
                    {this.state.locale}
                </p>
            </div>
        )
    }
}

export default App
