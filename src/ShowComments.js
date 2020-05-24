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

  editPost = async voteData => {
        voteData.account = this.props.accounts[0];
        await this.props.thread.post(voteData);
        this.props.getCommentsThread();
      };

  // i need a button to ask for metamask
  openMetamask= () => {
          this.props.askMetamask();
        }

render() {
     return (
       <div className="container relative">
        <p className={'text-lg text-gray-900'}>Drag the note and drop your comment!</p>
        <div className="items-center text-center">
          <div className="mx-auto">
            <p className="my-4">
              <button onClick={this.openMetamask} className="underline">
                Got Metamask? Click here to open 3box Thread
              </button>
              {/*{ this.props.needsAWeb3Browser &&
                <a href="https://metamask.io/download.html" rel="noopener noreferrer" target="_blank" className="underline">
                  Install metamask first
                </a>
              }*/}

              {!this.props.thread && (
                <div className="mx-auto text-gray-700">
                  <p>
                   Loading posts... You may have to sign MetaMask 3 times.
                 </p>
                </div>
              )}
              {this.props.thread && <InputComments needsAWeb3Browser={this.props.needsAWeb3Browser} savePost={this.savePost} />}
            </p>
           </div>

       </div>

       <div>
         {/*{(!this.props.posts || this.props.posts.length < 1) && (
           <div className="mx-auto text-center text-gray-700 mb-12">
             <p> loading... </p>
           </div>
         )}*/}
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
                   needsAWeb3Browser={this.props.needsAWeb3Browser}
                   editPost={this.editPost}
                   accounts={this.props.accounts}
                   thread={this.props.thread}
                   getCommentsThread={this.props.getCommentsThread.bind(this)}
                   />
             );
           })}
       </div>

     </div>
     );
   }
 }

 class CommentCard extends Component {

   state = {
     voteSum: 0,
   };

   editPost = async voteData => {
       voteData.account = this.props.accounts[0];
       voteData.comment = this.props.post.message.comment;
       voteData.deltaPosition = this.props.post.message.deltaPosition;
       voteData.rating = this.props.post.message.rating;
       const voteSumPrevious = this.props.post.message.voteSum ? this.props.post.message.voteSum : 0;
       voteData.voteSum = this.state.voteSum + voteSumPrevious;
       await this.props.thread.deletePost(this.props.post.postId);
       await this.props.thread.post(voteData);
       await this.props.getCommentsThread();
       console.log(this.props.post.message);
     };

   upvote = () => {
     //console.log(`${this.state.voteSum} voteSum in state before upvote`);
     this.state.voteSum = 1;
     //console.log(`${this.state.voteSum} voteSum in state after upvote`);
     this.editPost({
       voteSum: this.state.voteSum
     });
   };

   downvote = () => {
     this.state.voteSum = -1;
     this.editPost({
       voteSum: this.state.voteSum
     });
   };

   render(){
     return (
     <div className="h-0">
       <Draggable defaultPosition={this.props.post.message.deltaPosition}>
       <div className="comments-box-landing bg-white rounded shadow flex flex-col mx-auto items-center">
        <div className="relative flex flex-row" style={{ padding: "20px" }}>
          { !this.props.needsAWeb3Browser &&
          <div className="flex flex-col">
            <div className="comment_vote">
              <button className="vote_btn vote_btn-middle" onClick={this.upvote}>
              <div className={`upvoteIcon h-4 w-4 ${this.state.voteSum > 0 ? "upVoted" : ""}`}></div>
              {/*<img src={arrowUp} alt="Upvote" width="50" className={`vote_icon upvote ${this.voted ? "voted" : ""}`}/>*/}
              </button>
              {/*<div className={`text-center ${countClass}`}>{count}</div>
              <p className="text-center text-xs text-gray-500">{this.state.voteSum}</p>*/}
              <p className="text-center text-xs text-gray-500">{this.props.post.message.voteSum}</p>
              <button className="vote_btn" onClick={this.downvote}>
              {/*<img src={arrowDown} alt="Downvote" width="50" className={`vote_icon downvote ${this.voted ? "voted" : ""}`}/>*/}
              <div className={`downvoteIcon h-4 w-4 ${this.state.voteSum < 0 ? "downVoted" : ""}`}></div>
              </button>
            </div>
          </div>
          }

         <div className="relative" style={{ padding: "20px" }}>
           <p>
             {this.props.post.message.comment ? this.props.post.message.comment : "unknown"}
           </p>
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
       </div>
       </Draggable>
     </div>)
   }
 }
