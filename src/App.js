import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select} from 'antd';
import 'antd/dist/antd.css';
const { Header, Content} = Layout;
const { Meta } = Card;
const InputGroup = Input.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

//API key hidden in .env file -> gitignore
const api_key = process.env.REACT_APP_API_KEY

//Tuple of all NASA centers, value is used for API request
const options = [
  { label: 'All', value: '' },
  { label: 'Jet Propulsion Laboratory (JPL)', value: 'JPL' },
  { label: 'Headquarters (HQ)', value: 'HQ' },
  { label: 'Kennedy Space Center (KSC)', value: 'KSC' },
  { label: 'Goddard Space Flight Center (GSFC)', value: 'GSFC' },
  { label: 'Langley Research Center (LARC)', value: 'LARC' },
  { label: 'Ames Research Center (ARC)', value: 'ARC' },
  { label: 'Marshall Space Flight Center (MSFC)', value: 'MSFC' },
  { label: 'John C. Stennis Space Center (SSC)', value: 'SSC' },
  { label: 'Armstrong Flight Research Center (ARFC)', value: 'ARFC' },
];

const sortOptions = ["Newest First", "Oldest First", "Alphabetical"]

// <Panel header="Sort Results" key="2">
//   <Col>
//   <Select defaultValue="All" style={{ width: 300, paddingBottom: 20}} id = "sort">
//   </Select>
//   <Button  type="secondary" htmlType="submit" >Update Search</Button>
//   </Col>
// </Panel>

class App extends Component {
  state = {
      nasaData: "",
      search: "",
      location: "",
      visible: false,
      currentItem: 0,
      currentFav: 0,
      checkedCenters: [],
  }

//Function for opening Modal to show image metadata
showModal = (index) => {
  if(this.state.current == "favorite"){
    this.setState({
      visible: true,
      currentFav: index
    });
  }
  else{
  this.setState({
    visible: true,
    currentItem: index
  });
}
}

//Modal Button Function
handleOk = (e) => {
   this.setState({
     visible: false,
   });
 }

 //Modal Button Function
 handleCancel = (e) => {
   this.setState({
     visible: false,
   });
 }

  //General function for storing user input from inout fields
  handleUserInput = e => {
    //Add error checking for years here
    ls.set(e.target.id, e.target.value)
  };

  //Stores which NASA centers are selected
  onChange = checkedValues => {
    this.setState({
      checkedCenters: checkedValues
    })
  }

  //onClick function for search history list,
  //searches for whatever item is clicked on
  onClick = item => {
    ls.set("search", item)
    this.search()
  }

  //Menu selector, changes page
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  //Which NASA center to search for
  setCenter = center => {
    ls.set("center", center)
  }


  //Search function, sends request to NASA's api
  //Adds search fields to search history array
  search = e => {
    var searchString = ""
    //API Request
    searchString = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year_start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
    //Axios used for API request
    axios.get(searchString)
    .then((res => {
    let data = res.data;
    this.setState({nasaData: data.collection})
    }))
    //Updates search history
    var searchHistory = ls.get("searchHistory")
    searchHistory = JSON.parse(searchHistory)
    searchHistory.push(ls.get("search"))
    ls.set("searchHistory", JSON.stringify(searchHistory))
    ls.set("startYear", "1920")
    ls.set("endYear", "2019")
    ls.set("center", "")
  }

  //Clears search history
  clearSearch = e => {
    var array = []
    ls.set("searchHistory", JSON.stringify(array))
    this.setState({})
  }

  //Add JSON item to Favorite
  addFavorite = e => {
    if(this.state.nasaData != ""){
      var favorites = ls.get("favorites")
      favorites = JSON.parse(favorites)
      favorites.push(this.state.nasaData.items[this.state.currentItem])
      ls.set("favorites", JSON.stringify(favorites))
    }
  }

  //Called when componenet loads
  componentDidMount() {
      var array = []
      //Setting up local storage on first use
      if(!ls.get("endYear")){
        ls.set("startYear", "1920")
      }
      if(!ls.get("endYear")){
        ls.set("endYear", "2019")
      }
      if(ls.get("center") == "null" || !ls.get("center")){
        ls.set("center", "")
      }
      if(ls.get("searchHistory") == "null"|| !ls.get("searchHistory")){
        ls.set("searchHistory", JSON.stringify(array))
      }
      if(ls.get("favorites") == "null" || !ls.get("favorites")){
        ls.set("favorites", JSON.stringify(array))
      }
      if(!ls.get("search")){
        ls.set("search", "")
      }
      if(!ls.get("location")){
        ls.set("location", "")
      }
      this.setState({

      })
      //Axios call, shows last search on start up
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .then((res => {
      let data = res.data;
      this.setState(
        {
          nasaData: data.collection,
        })
      }))
}

  render() {
    var array = []
    if(this.state.nasaData != ""){

    //Maps each photo to a display card, displayed in a grid
    var photos = this.state.nasaData.items.slice(0, 50).map((item,index) => {
          return(
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
        <Card value = {index} hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showModal(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showModal(index)}
        />
        </Card>
        </Col>
      )})
    }
    else{
      var photos = null
    }
    if(this.state.nasaData != "" && ls.get("favorites") != JSON.stringify(array)){
    var favPhotos = JSON.parse(ls.get("favorites")).reverse().map((item,index) => {
      return(
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
        <Card  hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showModal(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showModal(index)}
        />
        </Card>
        </Col>
      )
    })
  }
  else{
    var favPhotos = null
  }

    var centers = options.map(option => {
      return(
        <Option value={option.value} onClick= {() => this.setCenter(option.value)} >{option.label}</Option>
      )}
    )
    if(this.state.current == "favorite"){
      return (
        <div>
        <Header>
          <Content style = {{color: "white", textAlign: 'center',  fontSize: "large"}}>
          Nasa Image Library Search
          </Content>
        </Header>
        <div style = {{textAlign: 'center'}}>
        <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        >
        <Menu.Item key="home page">
          <Icon type="home" />Home Page
        </Menu.Item>
        <Menu.Item key="app">
          <Icon type="camera" />Image Search
        </Menu.Item>
        <Menu.Item key="favorite">
          <Icon type="star" />Favorite Images
        </Menu.Item>
        </Menu>
        </div>
        {favPhotos}
        {(this.state.nasaData != "" && ls.get("favorites") != JSON.stringify(array))
        ?<Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title = {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].title}>
          <p> Center: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].center} </p>
          <p> Date Created: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].date_created}</p>
          <p> Description: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].description_508}</p>
          <div style= {{textAlign: "center"}}>
          </div>
        </Modal>:
        <div/>
        }
        </div>
      )
    }
    console.log(this.state.nasaData)
    return (
      <div className="App">
      <Header>
        <Content style = {{color: "white", textAlign: 'center',  fontSize: "large"}}>
        Nasa Image Library Search
        </Content>
      </Header>
      <Menu
      onClick={this.handleClick}
      selectedKeys={[this.state.current]}
      mode="horizontal"
      >
      <Menu.Item key="home page">
        <Icon type="home" />Home Page
      </Menu.Item>
      <Menu.Item key="app">
        <Icon type="camera" />Image Search
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="star" />Favorite Images
      </Menu.Item>
      </Menu>
      <div className= "SearchForm">
      <Search style={{ width: 400, textAlign: 'center'}} placeholder="Search" id = "search" onChange={e => this.handleUserInput(e)} />
      <div className= "MoreOptions" style = {{paddingLeft: "35.4%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: 400}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <div><strong>Search by Start Year and/or End Year</strong></div>
          <br/>
          <Search style={{ width: 350}} type="number"  placeholder="Start Year" id= "startYear" onChange={e => this.handleUserInput(e)}/>
          <Search style={{ width: 350}} type="number" placeholder="End Year" id= "endYear" onChange={e => this.handleUserInput(e)}/>
          <div><strong>Search by NASA Centers</strong></div>
          <br/>
          <Select defaultValue="All" style={{ width: 300 }} options={options} id = "center">
          {centers}
          </Select>
          </Col>
        </Panel>
        <Panel header="Search History" key="3">
          <Col>
          </Col>
          {(ls.get("searchHistory") != null)
          ?<List
            header={<div><strong>Click Item to Search</strong></div>}
             size="small"
             dataSource={JSON.parse(ls.get("searchHistory")).reverse()}
             renderItem={item => (
               <List.Item style = {{cursor: "pointer"}} value = {item}  onClick = {() => this.onClick(item)}>{item}</List.Item>
             )}
           />:
           <div></div>
         }
          <Button  type="secondary" htmlType="submit" onClick = {e => this.clearSearch(e)}> Clear Search History </Button>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" onClick = {e => this.search(e)}> Submit </Button>
      </div>
      {photos}
      {(this.state.nasaData != "" && this.state.nasaData != "null")
      ?<Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        title = {this.state.nasaData.items[this.state.currentItem].data[0].title}>
        <p> Center: {this.state.nasaData.items[this.state.currentItem].data[0].center} </p>
        <p> Date Created: {this.state.nasaData.items[this.state.currentItem].data[0].date_created} </p>
        {(this.state.nasaData.items[this.state.currentItem].data[0].photographer != null)
          ?<p> Photogapher: {this.state.nasaData.items[this.state.currentItem].data[0].photographer} </p>
          :<div></div>
        }
        {(this.state.nasaData.items[this.state.currentItem].data[0].description_508 != null)
        ?<p> Description: {this.state.nasaData.items[this.state.currentItem].data[0].description_508} </p>
        :<p>Description: {this.state.nasaData.items[this.state.currentItem].data[0].description} </p>
        }
        <div style= {{textAlign: "center"}}>
        <Button icon="star" onClick = {e => this.addFavorite(e)}>Add to Favorites</Button>
        </div>
      </Modal>:
      <div/>
      }
      </div>
    );
  }
}

export default App;
