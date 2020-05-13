import React, {Component} from 'react';
//import Box from "3box";
import InputComments from './InputComments';
import ProfileHover from "profile-hover";
//import { ScaleLoader } from "react-spinners";
import Draggable from 'react-draggable';
import ReactStars from 'react-stars';

export default class ShowComments extends Component {
  state = {
    thread: null
  };

  savePost = async formData => {
      // add the loggedin account to the form data to be saved
      formData.account = this.props.accounts[0];
      await this.props.thread.post(formData);
      this.props.getCommentsThread();
    };

render() {
     return (
       <div className="container relative">
        <p className={'text-lg text-gray-900'}>Drag the note and drop your comment!</p>
        <div className="items-center text-center">
          <div className="mx-auto">
            <p className="my-4">
              { this.props.needsAWeb3Browser &&
                <a href="https://metamask.io/download.html" rel="noopener noreferrer" target="_blank" className="underline">
                  Install metamask first
                </a>
              }

              {!this.props.thread && (
                <div style={{ width: "100px", margin: "auto" }}>
                  <p> loading 3box thread... </p>
                </div>
              )}
              {this.props.thread && <InputComments savePost={this.savePost} />}
            </p>
           </div>

       </div>

       <div>
         {(!this.props.posts || this.props.posts.length < 1) && (
           <div className="mx-auto text-center text-gray-700 mb-12">
             <p> loading... </p>
             <p>
               loading posts... MetaMask will ask you to sign access 3 times.
             </p>
           </div>
         )}
         {this.props.posts &&
           this.props.posts.map((post, i) => {
             return (
                 <CommentCard
                   post={post}
                   key={i}
                   threeBox={this.props.threeBox}
                   space={this.props.space}
                   box={this.props.box}
                   usersAddress={this.props.usersAddress}
                   i={i} />
             );
           })}
       </div>

     </div>
     );
   }
 }

 class CommentCard extends Component {
   render(){
     return (
     <div className="h-0">
       <Draggable defaultPosition={this.props.post.message.deltaPosition}>
       <div className="comments-box-landing bg-white rounded shadow flex flex-col mx-auto items-center">
         <div className="relative" style={{ padding: "20px" }}>
           <p>
             {this.props.post.message.comment ? this.props.post.message.comment : "unknown"}
           </p>
           {/*<p>
             {`${this.props.post.message.rating} stars` ? `${this.props.post.message.rating} stars` : "unknown"}
           </p>*/}
           {/*<p className="text-xs text-gray-500">
             Position: x: {this.props.post.message.deltaPosition.x ? this.props.post.message.deltaPosition.x : "unknown"}, y: {this.props.post.message.deltaPosition.y ? this.props.post.message.deltaPosition.y : "unknown"}
           </p>*/}
           {this.props.post.message.account && (
             <div className="pt-4">
               {/*
                 <ProfileHover
                   address={this.props.post.message.account}
                   showName={true}
                 />*/}
               <ReactStars
                 count={5}
                 size={20}
                 color2={'#ffd700'}
                 edit={false}
                 half={false}
                 value={this.props.post.message.rating}
               />
             </div>
           )}
         </div>
       </div>
       </Draggable>
     </div>)
   }
 }
