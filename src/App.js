import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, Button, Col, Card, Modal} from 'antd';
import 'antd/dist/antd.css';
const { Meta } = Card;
const InputGroup = Input.Group;
const Search = Input.Search;


const api_key = process.env.REACT_APP_API_KEY
var searchHistory = [];


class App extends Component {
  state = {
      nasaData: "",
      search: "",
      test: "hello",
      visible: false,
  }

  showModal = () => {
  this.setState({
    visible: true,
  });
}

handleOk = (e) => {
   console.log(e);
   this.setState({
     visible: false,
   });
 }

 handleCancel = (e) => {
   console.log(e);
   this.setState({
     visible: false,
   });
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
    var searchHistory
    if(ls.get("searchHistory") != ""){
      searchHistory = ls.get("searchHistory")
    }
    else{
      searchHistory = []
      ls.set("searchHistory", JSON.stringify(searchHistory))
    }
    searchHistory = JSON.parse(searchHistory)
    searchHistory.push(ls.get("search"))
    ls.set("searchHistory", JSON.stringify(searchHistory))
  }

  componentDidMount() {
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .then((res => {
      let data = res.data;
      this.setState({nasaData: data.collection})
      }))
}

  render() {
    console.log("Search History: " + ls.get("searchHistory"))
    if(this.state.nasaData != ""){
        console.log(this.state)
    }
    if(this.state.nasaData != ""){
    var photos = this.state.nasaData.items.slice(0, 25).map((item,index) => {
          return(
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
        <Card hoverable cover={<img src= {item.links[0].href} onClick= {this.showModal} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {this.showModal}
        />
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
      <Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      />
      </div>
    );
  }
}

export default App;
