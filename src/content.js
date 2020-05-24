/*global chrome*/
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
//import "./styles/content.css";
//import "./styles/outside.css";
import './styles/tailwind.css';
import './styles/index.css';
//import Eth from 'ethjs';
import Box from "3box";
import Portis from '@portis/web3';
import Web3 from 'web3';
import ShowComments from './ShowComments.js';
import createMetaMaskProvider from 'metamask-extension-provider';
const provider = createMetaMaskProvider();

const getThreeBox = async address => {
  const profile = await Box.getProfile(address);
  return profile;
};

const portis = new Portis('6cf6865e-0e78-4633-ba0d-ba4e3d96416c', 'mainnet');
const web3 = new Web3(portis.provider);

export default class Main extends Component {

  state = {
    needsAWeb3Browser: false
  };

  async componentDidMount() {
    portis.onLogin(() => {
      console.log("Logged in!");
    });
      this.setState({ needsAWeb3Browser: true });
      const currentURL = window.location.href;
      const cleanCurrentURL = currentURL.replace(/\//g, "_");
      const cleanerCurrentURL = cleanCurrentURL.replace(/\./g, "_");
      console.log("window undefined");
      console.log(cleanerCurrentURL);
      const threadCommentsThisURL = await Box.getThread(cleanerCurrentURL, 'xanadu_now_sh_comments', "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu", false );
      this.setState({ threadCommentsThisURL });
      console.log(threadCommentsThisURL);
  }

  async askMetamask() {

      //window.web3.autoRefreshOnNetworkChange = false;
      this.setState({ needsAWeb3Browser: false });
      const accounts = await web3.eth.getAccounts();
      this.setState({ accounts });
      console.log(`Detected Portis account ${accounts[0]}`);

      //const threeBoxProfile = await getThreeBox(this.state.myaccount);
      const threeBoxProfile = await getThreeBox(accounts[0]);
      this.setState({ threeBoxProfile });
      console.log(`does it detect a threeBoxProfile? ${JSON.stringify(threeBoxProfile)}`);

      const chris = "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu";
      const box = await Box.openBox(accounts[0], web3.currentProvider);
      this.setState({ box });
      console.log(`does it detect a threeBox box? ${box}`);
      const currentURL = window.location.href;
      const cleanCurrentURL = currentURL.replace(/\//g, "_");
      console.log("window defined, all good");
      console.log(cleanCurrentURL);
      const cleanerCurrentURL = cleanCurrentURL.replace(/\./g, "_");
      console.log(cleanerCurrentURL);
      const space = await this.state.box.openSpace(cleanerCurrentURL);
      this.setState({ space });
      console.log(space);

      const threadComments = await space.joinThread("xanadu_now_sh_comments", {
        firstModerator: chris,
        members: false
      });
      this.setState({ threadComments }, ()=>(this.getCommentsThread()));
      console.log(threadComments);
  }

  async getCommentsThread() {
    if (!this.state.threadComments) {
      console.error("comments thread not in react state");
      return;
    }
    const comments = await this.state.threadComments.getPosts();
    this.setState({comments});
    await this.state.threadComments.onUpdate(async()=> {
      const comments = await this.state.threadComments.getPosts();
      this.setState({comments});
    })
  }

  render() {

    let threadWithOrWithoutMetamask = 0;
    let postsWithOrWithoutMetamask = 0;

    if (this.state.needsAWeb3Browser) {
      threadWithOrWithoutMetamask = this.state.threadCommentsThisURL;
      postsWithOrWithoutMetamask = this.state.threadCommentsThisURL;
    } else {
      threadWithOrWithoutMetamask = this.state.threadComments;
      postsWithOrWithoutMetamask = this.state.comments;
    }

    return (
        <Frame id="very-unique-iframe-name" head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
          <FrameContextConsumer>
           {
           // Callback is invoked with iframe's window and document instances
              ({ document, window }) => {
                // Render Children
                return (
                   <div className="p-8 bg-white w-1/5 top-0 right-0 absolute shadow-lg bg-gray-300">
                       <ShowComments
                         accounts={this.state.accounts}
                         thread={threadWithOrWithoutMetamask}
                         box={this.state.box}
                         space={this.state.space}
                         threadMembers={this.state.threadMembers}
                         posts={postsWithOrWithoutMetamask}
                         threeBoxProfile={this.state.threeBoxProfile}
                         //getAppsThread={this.getAppsThread.bind(this)}
                         getCommentsThread={this.getCommentsThread.bind(this)}
                         askMetamask={this.askMetamask.bind(this)}
                         usersAddress={
                           this.state.accounts ? this.state.accounts : null
                         }
                         needsAWeb3Browser={this.state.needsAWeb3Browser}
                       />
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
