import React, { Component, createContext } from "react";
import debounce from "lodash.debounce";

const debounceWaitTime = 1000; // 1 second

const { Provider, Consumer: WindowSizeConsumer } = createContext({
  scrollHeight: window.innerHeight + window.scrollY,
  documentHeight: document.body.offsetHeight,
  updateHeights: () => {}
});

class WindowSizeProvider extends Component {
  state = {
    scrollHeight: window.innerHeight + window.scrollY,
    documentHeight: document.body.offsetHeight,
    updateHeight: this.updateHeights
  };

  printHeights = () => {
    const { scrollHeight, documentHeight } = this.state;
    console.log(
      `WindowSizeProvider.updateHeights(scrollHeight, documentHeight)`,
      scrollHeight,
      documentHeight,
      document.body.offsetHeight
    );
  };

  updateHeights = () => {
    this.setState(
      {
        scrollHeight: window.innerHeight + window.scrollY,
        documentHeight: document.body.offsetHeight
      },
      this.printHeights
    );
  };

  windowSizeHandler = e =>
    this.setState(
      {
        scrollHeight: window.innerHeight + window.scrollY,
        documentHeight: document.body.offsetHeight
      },
      this.printHeights
    );

  componentDidMount() {
    // https://stackoverflow.com/a/9439807/4035
    // Demo: http://jsfiddle.net/dance2die/8PkQN/1769/
    window.addEventListener(
      "scroll",
      debounce(this.windowSizeHandler, debounceWaitTime)
    );
    window.addEventListener(
      "resize",
      debounce(this.windowSizeHandler, debounceWaitTime)
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.windowSizeHandler);
    window.removeEventListener("resize", this.windowSizeHandler);
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

// class WindowSizeContext extends Component {
//   state = {
//     scrollHeight: 0,
//     documentHeight: 0,
//     updateHeight: this.updateHeight
//   };

//   updateHeight = e => {
//     console.log(`updateHeight called!`);
//     this.windowSizeHandler();
//   };

//   windowSizeHandler = e =>
//     this.setState({
//       scrollHeight: window.innerHeight + window.scrollY,
//       documentHeight: document.body.offsetHeight
//     });

//   componentDidMount() {
//     // https://stackoverflow.com/a/9439807/4035
//     // Demo: http://jsfiddle.net/dance2die/8PkQN/1769/
//     window.addEventListener(
//       "scroll",
//       debounce(this.windowSizeHandler, debounceWaitTime)
//     );
//     window.addEventListener(
//       "resize",
//       debounce(this.windowSizeHandler, debounceWaitTime)
//     );
//   }

//   componentWillUnmount() {
//     window.removeEventListener("scroll", this.windowSizeHandler);
//     window.removeEventListener("resize", this.windowSizeHandler);
//   }

//   render() {
//     return <div>{this.props.children(this.state)}</div>;
//   }
// }

// export default WindowSizeContext;
export { WindowSizeProvider, WindowSizeConsumer };
