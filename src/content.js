/*global chrome*/
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
//import "./styles/content.css";
//import "./styles/outside.css";
import './styles/tailwind.css';
import './styles/index.css';
import Draggable from 'react-draggable';
import Eth from 'ethjs';
import NewComment from './newcomment.js';
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

export default class Main extends Component {

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
        <Frame id="very-unique-iframe-name" head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
          <FrameContextConsumer>
           {
           // Callback is invoked with iframe's window and document instances
              ({ document, window }) => {
                // Render Children
                return (
                   <div className="p-8 bg-white w-1/5 top-0 right-0 absolute shadow-lg bg-gray-300">
                      <p className={'text-lg text-gray-900'}>add ya comment, ma boi</p>
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
                       <NewComment />
                   </div>
                );
              }
            }
           </FrameContextConsumer>
        </Frame>
    );
  }
}

const app = document.createElement('div');
app.id = "very-unique-naming-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
  if(app.style.display === "none"){
    app.style.display = "block";
  } else {
    app.style.display = "none";
   }
}
