import React, { Component } from 'react';
import './App.css';
import { getData } from './api';
import { createChart } from './chart';

class App extends Component {
  state = {
    data: [],
    svg: null,
  }

  componentDidMount() {
    getData().then((data) => {
      this.setState({
        data,
      }, () => createChart(this.svg.id, this.state.data));
    });
  }

  id = data => data.id;

  render() {
    return (
      <div className="App">
        <svg ref={(elm) => this.svg = elm} id="chart">
        </svg>
      </div>
    );
  }
}

export default App;
