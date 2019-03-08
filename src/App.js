import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY

class App extends Component {
  state = {
      nasaData: []
  }
  componentDidMount() {
      axios.get('https://api.nasa.gov/EPIC/api/natural/images?api_key='+api_key)
      .then((res => {
      let nasaData = res.data;
      this.setState({nasaData})
      console.log(this.state.nasaData)
      }))
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
