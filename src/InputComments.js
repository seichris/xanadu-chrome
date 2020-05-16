import React, { Component } from "react";
import ReactStars from 'react-stars';
import Draggable from 'react-draggable';

const blankState = {
  comment: "",
  rating: 0,
  deltaPosition: {
        x: 0, y: 0
      }
};
export default class InputComments extends Component {
  state = blankState;

  handleChange = event => {
    this.setState(Object.assign({ [event.target.name]: event.target.value }));
  };

  ratingChanged = (newRating) => {
    console.log(`${newRating} stars`);
    this.setState(Object.assign({ rating: newRating }));
  };

  async validateFormFields() {
    console.log("to do - validiate form");
  }

  handleSubmit = event => {
    event.preventDefault();
    this.validateFormFields();

    this.props.savePost({
      comment: this.state.comment,
      rating: this.state.rating,
      deltaPosition: this.state.deltaPosition,
    });

    //this.setState(Object.assign({}, blankState, { submitted: true }));
    this.setState(Object.assign({}, blankState, { deltaPosition: { x: 0, y: 0 } }));
    let activeBox = document.querySelector(".activeBox");
    activeBox.style.transform = "translate(0, 0)";
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
      <>
        { this.props.needsAWeb3Browser ?
          <>
          <p> Seems like you don't have a web3 browser.
          </p>
          <a href="https://metamask.io/download.html" rel="noopener noreferrer" target="_blank" className="underline">
            Install metamask to add your comment!
          </a>
          </>
        :
        <Draggable
          //axis="x"
          //handle=".handle"
          defaultPosition={{x: 0, y: 0}}
          position={this.deltaPosition}
          //grid={[25, 25]}
          scale={1}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.onControlledDragStop}
        >
            <div className="w-full mx-auto bg-white activeBox rounded shadow">
                <form onSubmit={this.handleSubmit}>
                  <div className="py-4 flex flex-row items-center">
                    <div className="mx-4">
                     How do your rate this site?
                    </div>
                    <ReactStars
                      count={5}
                      onChange={this.ratingChanged}
                      size={20}
                      color2={'#ffd700'}
                      edit={true}
                      half={false}
                      value={this.state.rating}
                    />
                  </div>
                  <div>
                    <textarea
                      className="w-full shadow-inner p-4 border-0 relative"
                      placeholder="Add your comment."
                      rows="2"
                      value={this.state.comment}
                      onChange={this.handleChange}
                      type="text"
                      name="comment"
                      aria-describedby="commentText"
                    />
                    <input type="submit" className="inline-block py-2 px-2 leading-none text-white bg-indigo-500 hover:bg-indigo-600 rounded shadow absolute bottom-0 right-0" value="Submit"/>
                  </div>
                </form>
            </div>
          </Draggable>
          }
        </>
        );
      }
}
