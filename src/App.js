import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, Button } from 'antd';
import 'antd/dist/antd.css';
const InputGroup = Input.Group;
const Search = Input.Search;


const api_key = process.env.REACT_APP_API_KEY


class App extends Component {
  state = {
      nasaData: "",
      search: ""
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
    console.log(ls.get("search") != null)
    return (
      <div className="App">
      <div className= "SearchForm">
      <InputGroup>
      <Search style={{ width: 200, textAlign: 'center' }} placeholder="Search" id = "search" onChange={e => this.handleUserInput(e)}  enterButton/>
      <Search style={{ width: 200, textAlign: 'center' }} placeholder="Location" enterButton/>
      </InputGroup>
      <br/>
      <Button onClick = {e => this.search(e)}> Submit </Button>
      </div>
      {(this.state.nasaData != "")
      ?<header> {this.state.nasaData.items[2].data[0].title} </header>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<img  style = {{width: 400, height: 400}} src = {this.state.nasaData.items[2].links[0].href}/>:
      <div> </div>
      }
      {(this.state.nasaData != "")
      ?<p> {this.state.nasaData.items[2].data[0].description} </p>:
      <div> </div>
      }
      <PhotoDisplay/>
      </div>
    );
  }
}

export default App;
