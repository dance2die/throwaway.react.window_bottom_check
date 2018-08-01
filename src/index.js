import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class BottomCheck extends Component {
  state = { isBottom: false };

  componentDidMount() {
    // https://stackoverflow.com/a/9439807/4035
    // Demo: http://jsfiddle.net/dance2die/8PkQN/1769/
    window.addEventListener("scroll", e => {
      // console.log(
      //   `innerHeight=${window.innerHeight}, scrollY=${
      //     window.scrollY
      //   }, innerHeight + scrollY = ${window.innerHeight +
      //     window.scrollY} document.body.offsetHeight=${
      //     document.body.offsetHeight
      //   }`
      // );
      // const isBottom = innerHeight + scrollY >= document.body.offsetHeight;
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      this.setState({ isBottom });
    });
  }

  render() {
    return <div>{this.props.children(this.state.isBottom)}</div>;
  }
}

function App() {
  const breaks = [...Array(50)].map(_ => <br />);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      {breaks}
      <BottomCheck>
        {isBottom => console.log(`isBottom=${isBottom}`)}
      </BottomCheck>
      <BottomCheck>
        {isBottom => (isBottom ? <div>Such wow!</div> : "xxx")}
      </BottomCheck>
      <p>We are at the bottom of the 🌊!!!</p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
