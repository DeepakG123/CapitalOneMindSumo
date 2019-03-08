import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ls from 'local-storage'


const api_key = process.env.REACT_APP_API_KEY

class App extends Component {
  state = {
      nasaData: "",
      search: "Neptune"
  }

  handleUserInput = e => {
    ls.set(e.target.id, e.target.value)
  };

  search = e => {
    axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
    .then((res => {
    let data = res.data;
    this.setState({nasaData: data.collection})
    }))
  }

  componentDidMount() {
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .then((res => {
      let data = res.data;
      this.setState({nasaData: data.collection})
      }))
}

  render() {
    if(this.state.nasaData != ""){
        console.log(this.state)
    }
    console.log(ls.get("search"))
    return (
      <div className="App">
      <div className= "SearchForm">
      <form>
        <label>
          Search for an Image:
          <input  id = "search" type="text" name="name" onChange={e => this.handleUserInput(e)} />
        </label>
        <button onClick = {e => this.search(e)}> Submit </button>
      </form>
      </div>
      {(this.state.nasaData != "")
      ?<header> {this.state.nasaData.items[20].data[0].title} </header>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<img src = {this.state.nasaData.items[20].links[0].href}/>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<p> {this.state.nasaData.items[20].data[0].description} </p>:
      <div> </div>
      }
      </div>
    );
  }
}

export default App;
