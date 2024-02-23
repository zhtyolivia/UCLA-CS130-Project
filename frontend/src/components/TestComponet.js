import React, { Component } from 'react';

class TestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:3001/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => console.error("API call failed:", err));
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <div>
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default TestComponent;
