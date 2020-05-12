import React from 'react';
import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';

import Eth from 'ethjs';
import createMetaMaskProvider from 'metamask-extension-provider';
const provider = createMetaMaskProvider();

provider.on('error', (error) => {
  // Failed to connect to MetaMask, fallback logic.
})

provider.sendAsync({
  method: 'eth_requestAccounts',
});

const blankState = {
  comment: "",
  rating: "",
  deltaPosition: {
        x: 0, y: 0
      }
};






if (provider) {
  console.log('provider detected', provider)
  const eth = new Eth(provider)
  console.log('MetaMask provider detected.')
  eth.accounts()
  .then((accounts) => {
    console.log(`Detected MetaMask account ${accounts[0]}`)
  })

  provider.on('error', (error) => {
    if (error && error.includes('lost connection')) {
      console.log('MetaMask extension not detected.')
    }
  })

} else {
  console.log('MetaMask provider not detected.')
}








class App extends React.Component {

  state = blankState;

    handleChange = event => {
      this.setState(Object.assign({ [event.target.name]: event.target.value }));
    };

    handleDrag = (e, ui, deltaPosition) => {
        const {x, y} = this.state.deltaPosition;
        this.setState(Object.assign({ deltaPosition: { x: x + ui.deltaX, y: y + ui.deltaY } }));
      };

    onControlledDragStop = (e, position) => {
        const {x, y} = position;
        this.setState(Object.assign({ deltaPosition: {x, y}}));
      };

  render() {
    return (
      <div className="App" id="texttochange">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Draggable
           axis="both"
           handle=".handle"
           defaultPosition={{x: 0, y: 0}}
           position={this.state.deltaPosition}
           //grid={[25, 25]}
           scale={1}
           onStart={this.handleStart}
           onDrag={this.handleDrag}
           onStop={this.onControlledDragStop}>
           <div>
             <div className="handle">what's your summary?</div>
             <div>Put text here</div>
             <div>x: {this.state.deltaPosition.x.toFixed(0)}, y: {this.state.deltaPosition.y.toFixed(0)}</div>
           </div>
         </Draggable>
      </div>
    );
  }
}

export default App;
