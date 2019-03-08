import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY

class App extends Component {
  state = {
      nasaData: "",
  }
  componentDidMount() {

      axios.get("https://images-api.nasa.gov/search?q=apollo%2011&description=moon%20landing&media_type=image")
      .then((res => {
      let data = res.data;
      this.setState({nasaData: data.collection})
      }))
}

  render() {
    if(this.state.nasaData != ""){
        console.log(this.state.nasaData.items[39].data[0])
    }
    return (
      <div className="App">
      {(this.state.nasaData != "")
      ?<header> {this.state.nasaData.items[39].data[0].title} </header>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<img src = {this.state.nasaData.items[39].links[0].href}/>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<p> {this.state.nasaData.items[39].data[0].description} </p>:
      <div> </div>
      }
      </div>
    );
  }
}

export default App;
