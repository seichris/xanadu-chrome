import React, {Component} from 'react';

export default class AddApp extends Component {
  render() {
       return (
      <section className="py-12 px-4 text-center">
        {/*<h2 className="text-4xl mb-2 leading-tight font-heading">...so we match these two sites, exactly where they now dont meet. this is how it works...</h2>
        <p className="text-gray-500">click the div to auth with ethereum and open your first note</p>*/}
        <div className="flex flex-wrap items-center -mx-8 mt-12 mb-2 font-mono">
          <div className="lg:w-1/4 px-8 mb-8">
            <p className=" mb-2">
            personalized content
            </p>
          </div>
          <div className="lg:w-1/4 px-8 mb-8">
            <p className=" mb-2">
            data privacy
            </p>
          </div>
          <div className="lg:w-1/4 px-8 mb-8">
            <p className=" mb-2">
            rewards on the blockchain
            </p>
          </div>
          <div className="lg:w-1/4 px-8 mb-8">
            <p className=" mb-2">
            interoperable
            </p>
          </div>
        </div>
      </section>
    );
  }
}
