/*global chrome*/
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
//import "./styles/content.css";
//import "./styles/outside.css";
import './styles/tailwind.css';
import './styles/index.css';
import Eth from 'ethjs';
import Box from "3box";
import ShowComments from './ShowComments.js';
import createMetaMaskProvider from 'metamask-extension-provider';
const provider = createMetaMaskProvider();

const getThreeBox = async address => {
  const profile = await Box.getProfile(address);
  return profile;
};


/*provider.on('error', (error) => {
  // Failed to connect to MetaMask, fallback logic.
})

provider.sendAsync({
  method: 'eth_requestAccounts',
});

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
}*/

export default class Main extends Component {

  state = {
    needsAWeb3Browser: false
  };

  async componentDidMount() {
    provider.sendAsync({
      method: 'eth_requestAccounts',
    });

    if (provider) {

      //window.web3.autoRefreshOnNetworkChange = false;
      console.log('provider detected', provider)
      const eth = new Eth(provider)
      console.log('MetaMask provider detected.')
      const accounts = await eth.accounts()
      .then((accounts) => {
        console.log(`Detected MetaMask account ${accounts[0]}`);
        const myaccount = accounts[0];
        this.setState({ myaccount });
        console.log(`Detected MetaMask account in state? ${this.state.myaccount}`);
      })
      this.setState({ accounts });
      //console.log(`Detected MetaMask account in state outside of this function, after adding await? ${this.state.accounts}`);
      //console.log(this.state.myaccount);
      console.log(`Detected MetaMask account in state outside of this function? ${this.state.myaccount}`);

      //const threeBoxProfile = await getThreeBox(this.state.myaccount);
      const threeBoxProfile = await getThreeBox(this.state.myaccount);
      this.setState({ threeBoxProfile });
      console.log(`does it detect a threeBoxProfile? ${JSON.stringify(threeBoxProfile)}`);

      const chris = "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu";
      const box = await Box.openBox(this.state.myaccount, provider);
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
      /*this.setState({ needsAWeb3Browser: true });
      const currentURL = window.location.href;
      const cleanCurrentURL = currentURL.replace(/\//g, "_");
      const cleanerCurrentURL = cleanCurrentURL.replace(/\./g, "_");
      console.log("window undefined");
      console.log(cleanerCurrentURL);
      const threadCommentsThisURL = await Box.getThread(cleanerCurrentURL, 'xanadu_now_sh_comments', "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu", false );
      this.setState({ threadCommentsThisURL });
      console.log(threadCommentsThisURL);*/

    } else {

      this.setState({ needsAWeb3Browser: true });
      const currentURL = window.location.href;
      const cleanCurrentURL = currentURL.replace(/\//g, "_");
      const cleanerCurrentURL = cleanCurrentURL.replace(/\./g, "_");
      console.log("window undefined");
      console.log(cleanerCurrentURL);
      const threadCommentsThisURL = await Box.getThread(cleanerCurrentURL, 'xanadu_now_sh_comments', "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu", false );
      this.setState({ threadCommentsThisURL });
      console.log(threadCommentsThisURL);
      /*window.web3.autoRefreshOnNetworkChange = false;
      const accounts = await window.web3.enable();
      this.setState({ accounts });

      const threeBoxProfile = await getThreeBox(this.state.accounts[0]);
      this.setState({ threeBoxProfile });

      const chris = "did:3:bafyreiefwktffgtt75edstz3kwcijfqsviv33okgciioreuzpari3lnqyu";
      const box = await Box.openBox(this.state.accounts[0], window.web3);
      this.setState({ box });
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
      console.log(threadComments);*/

    }
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
                      <p className={'text-lg text-gray-900'}>add a comment and drag drop it</p>
                       <ShowComments
                         accounts={this.state.myaccount}
                         thread={threadWithOrWithoutMetamask}
                         box={this.state.box}
                         space={this.state.space}
                         threadMembers={this.state.threadMembers}
                         posts={postsWithOrWithoutMetamask}
                         threeBoxProfile={this.state.threeBoxProfile}
                         //getAppsThread={this.getAppsThread.bind(this)}
                         getCommentsThread={this.getCommentsThread.bind(this)}
                         usersAddress={
                           this.state.myaccount ? this.state.myaccount : null
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
