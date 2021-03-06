import React, { Component } from "react";
import ReactDOM from "react-dom";
// import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

import "./styles.css";

import { getContent } from "./ContentRepo";

function createMarkup(html) {
  return { __html: html };
}

const RedditPost = ({
  post: { title, selftext, id, url, thumbnail },
  order
}) => (
  <div className="redditPost">
    <p className="postTitle">
      <a href={url} target="_blank">
        #{order} {title}
      </a>
    </p>
    <div
      className="redditText"
      dangerouslySetInnerHTML={createMarkup(selftext)}
    />
  </div>
);

const debounceWaitTime = 1000;
const debounceOptions = { leading: true, trailing: true };
const heightOffset = 1500;

class App extends Component {
  state = { posts: [], isBottomReached: false };
  repo = getContent();

  getNextPosts = async () => {
    const newPosts = (await this.repo.next()).value;
    this.setState(prevState => ({
      posts: [...prevState.posts, ...newPosts],
      isBottomReached: false
    }));
  };

  windowSizeHandler = e => {
    const isBottomReached =
      window.scrollY + window.innerHeight + heightOffset >=
      document.body.offsetHeight;

    this.setState({ isBottomReached }, async () => {
      if (isBottomReached) await this.getNextPosts();
    });
  };

  async componentDidMount() {
    // https://stackoverflow.com/a/9439807/4035
    // Demo: http://jsfiddle.net/dance2die/8PkQN/1769/
    window.addEventListener(
      "scroll",
      throttle(this.windowSizeHandler, debounceWaitTime, debounceOptions)
    );
    window.addEventListener(
      "resize",
      throttle(this.windowSizeHandler, debounceWaitTime, debounceOptions)
    );

    const { posts } = this.state;
    if (!posts || posts.length <= 0) {
      await this.getNextPosts();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.windowSizeHandler);
    window.removeEventListener("resize", this.windowSizeHandler);
  }

  loadMoreStories = () => {
    (async () => await this.getNextPosts())();
  };

  render() {
    const { posts, isBottomReached } = this.state;
    const postComponents = posts.map((post, i) => (
      <RedditPost key={post.id} post={post} order={i + 1} />
    ));

    return (
      <div className="App">
        {postComponents}
        {isBottomReached ? null : (
          <button className="loadMoreButton" onClick={this.loadMoreStories}>
            Load More Stories
          </button>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
