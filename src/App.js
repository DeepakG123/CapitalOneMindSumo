import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row} from 'antd';
import 'antd/dist/antd.css';
const { Header, Content} = Layout;
const { Meta } = Card;
const InputGroup = Input.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;

const api_key = process.env.REACT_APP_API_KEY
var searchHistory = [];


class App extends Component {
  state = {
      nasaData: "",
      search: "",
      location: "",
      visible: false,
      currentItem: 0
  }

  showModal = (index) => {
  console.log("index: " + index)
  this.setState({
    visible: true,
    currentItem: index
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
      if(!ls.get("search")){
        ls.set("search", "")
      }
      if(!ls.get("location")){
        ls.set("location", "")
      }
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
        <Card value = {index} hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showModal(index)} height="200" width="200"/>}
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
      <Header>
        <Content style = {{color: "white", textAlign: 'center',  fontSize: "large"}}>
        Nasa Image Library Search
        </Content>
      </Header>
      <div className= "SearchForm">
      <Search style={{ width: 300, textAlign: 'center'}} placeholder="Search" id = "search" onChange={e => this.handleUserInput(e)} />
      <div className= "MoreOptions" style = {{paddingLeft: "37.5%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: 350}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <Search style={{ width: 300}} placeholder="Location" id= "location" onChange={e => this.handleUserInput(e)}/>
          <Search style={{ width: 300}} placeholder="Start Year" id= "startYear" onChange={e => this.handleUserInput(e)}/>
          <Search style={{ width: 300}} placeholder="End Year" id= "endYear" onChange={e => this.handleUserInput(e)}/>
          </Col>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" onClick = {e => this.search(e)}> Submit </Button>
      </div>
      {photos}
      {(this.state.nasaData != "")
      ?<Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        title = {this.state.nasaData.items[this.state.currentItem].data[0].title}>
        <p> Center: {this.state.nasaData.items[this.state.currentItem].data[0].center} </p>
        <p> Date Created: {this.state.nasaData.items[this.state.currentItem].data[0].date_created} </p>
        <p> Description: {this.state.nasaData.items[this.state.currentItem].data[0].description_508} </p>
      </Modal>:
      <div/>
      }
      </div>
    );
  }
}

export default App;
