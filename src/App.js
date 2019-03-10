import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox} from 'antd';
import 'antd/dist/antd.css';
const { Header, Content} = Layout;
const { Meta } = Card;
const InputGroup = Input.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;


const api_key = process.env.REACT_APP_API_KEY
var searchHistory = [];

const options = [
  { label: 'Jet Propulsion Laboratory (JPL)', value: 'Jet Propulsion Laboratory (JPL)' },
  { label: 'Headquarters (HQ)', value: 'Headquarters (HQ)' },
  { label: 'Kennedy Space Center (KSC)', value: 'Kennedy Space Center (KSC)' },
  { label: 'Goddard Space Flight Center (GSFC)', value: 'Goddard Space Flight Center (GSFC)' },
  { label: 'Langley Research Center (LARC)', value: 'Langley Research Center (LARC)' },
  { label: 'Ames Research Center (ARC)', value: 'Ames Research Center (ARC)' },
  { label: 'Marshall Space Flight Center (MSFC)', value: 'Marshall Space Flight Center (MSFC)' },
  { label: 'John C. Stennis Space Center (SSC)', value: 'John C. Stennis Space Center (SSC)' },
  { label: 'Armstrong Flight Research Center (ARFC)', value: 'Armstrong Flight Research Center (ARFC)' },
];


class App extends Component {
  state = {
      nasaData: "",
      search: "",
      location: "",
      visible: false,
      currentItem: 0,
      checkedCenters: []
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

  onChange = checkedValues => {
    this.setState({
      checkedCenters: checkedValues
    })
  }


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
      <div className= "MoreOptions" style = {{paddingLeft: "31%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: 400}}>
        <Panel header="Date Range" key="1">
          <Col>
          <Search style={{ width: 350}} placeholder="Start Year" id= "startYear" onChange={e => this.handleUserInput(e)}/>
          <Search style={{ width: 350}} placeholder="End Year" id= "endYear" onChange={e => this.handleUserInput(e)}/>
          </Col>
        </Panel>
        <Panel header="Nasa Centers" key="2">
          <Col>
          <CheckboxGroup options={options} onChange = {checkedValues => this.onChange(checkedValues)} />
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
