import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, Button, Col, Card} from 'antd';
import 'antd/dist/antd.css';
const InputGroup = Input.Group;
const Search = Input.Search;


const api_key = process.env.REACT_APP_API_KEY


class App extends Component {
  state = {
      nasaData: "",
      search: "",
      test: "hello"
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
    if(this.state.nasaData != ""){
    var photos = this.state.nasaData.items.slice(0, 25).map((item,index) => {
          return(
        <Col span={6} style={{}}>
        <Card hoverable style={{ width: 240}} cover={<img src= {item.links[0].href}  height="200" width="200"/>}
          title={item.data[0].title}
        >
        </Card>
        </Col>
      )})
    }
    else{
      var photos = null
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
      {photos}
      </div>
    );
  }
}

export default App;
