// const React = require('lib/react')
// const ReactDOM = require('lib/react-dom')
const rootNode = document.querySelector('#app')
console.log(rootNode)

class MyComponent extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

ReactDOM.render(<MyComponent />, rootNode);