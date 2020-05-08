/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import "./styles/inside.css";
import "./styles/outside.css";
import './styles/tailwind.css';
import './styles/index.css';

class Main extends React.Component {
  render() {
    return (
        <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
          <FrameContextConsumer>
           {
           // Callback is invoked with iframe's window and document instances
              ({ document, window }) => {
                // Render Children
                return (
                   <div className={'main p-8'}>
                      <p className={'text-lg text-right text-gray-700'}>this should render new-comment-input</p>
                      <p className="text-left text-gray-900">try tailwind</p>
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
