import React, { Component } from 'react';
import './App.css';
import PhotoDisplay from './PhotoDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select, PageHeader, BackTop, message} from 'antd';
import 'antd/dist/antd.css';
import { Twitter, Facebook, Google } from 'react-social-sharing'
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

const sortOptions = ["Newest First", "Oldest First", "Alphabetical: A-Z", "Alphabetical: Z-A"]

const yearPattern = /^(19|20)\d{2}$/


class App extends Component {
  state = {
      nasaData: "",
      search: "",
      location: "",
      visible: false,
      infoVisible: false,
      currentItem: 0,
      currentFav: 0,
      checkedCenters: [],
      dateSort: false,
      sort: "",
      sortedData: []
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

//Function for opening  Information Modal
showInfoModal = (e) => {
  this.setState({
    infoVisible:true
  })
}

//General Modal Button Function
handleOk = (e) => {
  console.log("modal type: " + e.target.id)
   this.setState({
     visible: false,
   });
 }

 //General Modal Button Function
 handleCancel = (e) => {
   this.setState({
     visible: false,
   });
 }

 //General Modal Button Function
 handleInfoOk = (e) => {
   console.log("modal type: " + e.target.id)
    this.setState({
      infoVisible: false,
    });
  }

  //General Modal Button Function
  handleInfoCancel = (e) => {
    this.setState({
      infoVisible: false,
    });
  }


  //General function for storing user input from inout fields
  handleUserInput = e => {
    console.log(yearPattern.test( e.target.value))
    //Error checking for years here
    ls.set(e.target.id, e.target.value)
  };

  //Stores which NASA centers are selected
  onChange = checkedValues => {
    this.setState({
      checkedCenters: checkedValues
    })
  }

  handleChange = value => {
    this.setState({
      sort: value
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
    //Scroll to top on clicking a menu item
    window.scrollTo(0, 0);
  }

  //Which NASA center to search for
  setCenter = center => {
    ls.set("center", center)
  }

  //Sort result selection
  setSort = option => {
    ls.set("sort", option)
  }


  sortData = e => {
    var sort_array = [];
    for (var key in this.state.nasaData.items) {
        sort_array.push({key:key,title:this.state.nasaData.items[key].data[0].title, date:this.state.nasaData.items[key].data[0].date_created});
    }
    if(this.state.sort == "Newest First"){
    sort_array.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.date) - new Date(a.date);
    });
    }
    else if(this.state.sort == "Oldest First"){
    sort_array.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
    });
    }
    else if(this.state.sort == "Alphabetical: A-Z"){
      sort_array.sort(function(a,b){
      if(a.title < b.title) { return -1; }
      if(a.title > b.title) { return 1; }
      return 0;
      });
    }
    else if(this.state.sort == "Alphabetical: Z-A"){
      sort_array.sort(function(a,b){
      if(a.title < b.title) { return 1; }
      if(a.title > b.title) { return -1; }
      return 0;
      });
    }
    this.setState({
      sortedData: sort_array,
      dateSort:true
    })
  }

  clearSort = e => {
    this.setState({
      dateSort:false
    })
  }


  //Search function, sends request to NASA's api
  //Adds search fields to search history array
  search = e => {
    var searchString = ""
    //API Request
    if(!yearPattern.test(ls.get("startYear"))){
      ls.set("startYear", "1920")
    }
    if(!yearPattern.test(ls.get("endYear"))){
      ls.set("endYear", "2019")
    }
    searchString = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year_start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
    console.log(searchString)
    //Axios used for API request
    axios.get(searchString)
    .catch((error) =>{
      console.log("Bad Request")
    })
    .then((res => {
    let data = res.data;
    this.setState({nasaData: data.collection})
    }))
    //Updates search history
    var searchHistory = ls.get("searchHistory")
    searchHistory = JSON.parse(searchHistory)
    if(searchHistory[searchHistory.length-1] != ls.get("search")){
      searchHistory.push(ls.get("search"))
    }
    ls.set("searchHistory", JSON.stringify(searchHistory))
    ls.set("startYear", "1920")
    ls.set("endYear", "2019")
    ls.set("center", "")
  }

  //Function to handle bad searches
  badCall = e => {
    var searchHistory = ls.get("searchHistory")
    searchHistory = JSON.parse(searchHistory)
    message.warning('Search Returned No Results!');
    if(searchHistory.length > 1){
      ls.set("search", searchHistory[searchHistory.length-2])
    }
    else(
      ls.set("search","")
    )
    this.search()
  }

  //Clears search history
  clearSearch = e => {
    var array = []
    ls.set("searchHistory", JSON.stringify(array))
    this.setState({})
  }

  //Clears Favorites
  clearFavorites= e => {
    var array = []
    ls.set("favorites", JSON.stringify(array))
    this.setState({})
  }

  //Add JSON item to Favorite
  addFavorite = e => {
    if(this.state.nasaData != ""){
      var favorites = ls.get("favorites")
      favorites = JSON.parse(favorites)
      favorites.push(this.state.nasaData.items[this.state.currentItem])
      ls.set("favorites", JSON.stringify(favorites))
      message.success('Added to Favorites!');
    }
  }

  //Move to next item
  nextItem = e => {
    this.setState({
      currentItem: this.state.currentItem+1
    })
  }

  //Called when componenet loads
  componentDidMount() {
      var array = []
      //Setting up local storage on first use
      if(!ls.get("startYear")){
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
      if(!ls.get("sort")){
        ls.set("sort", "")
      }
      this.setState({

      })
      //Axios call, shows last search on start up
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .catch((error) =>{
        console.log("Bad Request")
      })
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
      console.log(ls.get("searchHistory"))
      if(this.state.nasaData.metadata.total_hits == 0){
        this.badCall();
      }

    //Maps each photo to a display card, displayed in a grid
    if(this.state.dateSort && this.state.nasaData.metadata.total_hits != 0){
      var photos = this.state.sortedData.map((item,index) => {
            return(
          <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
          <Card value = {parseInt(item.key)} hoverable cover={<img src= {this.state.nasaData.items[item.key].links[0].href} onClick= {() => this.showModal(parseInt(item.key))} height="200" width="200"/>}
          >
          <Meta
            title={this.state.nasaData.items[item.key].data[0].title}
            onClick= {() => this.showModal(parseInt(item.key))}
          />
          </Card>
          </Col>
        )})
    }
    else{
    var photos = this.state.nasaData.items.map((item,index) => {
          return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
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
    }
    else{
      var photos = null
    }
    if(this.state.nasaData != "" && ls.get("favorites") != JSON.stringify(array)){
    var favPhotos = JSON.parse(ls.get("favorites")).reverse().map((item,index) => {
      return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
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

    var sorts = sortOptions.map(option => {
      return(
        <Option value={option} onClick= {() => this.setSort(option)} >{option}</Option>

      )
    })
    if(this.state.current == "favorite"){
      return (
        <div>
        <div style= {{position: 'fixed', width: '100%', zIndex: 1}}>
        <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px', textAlign: 'center' }}
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
        >
        <Menu.Item key="info" onClick= {() => this.showInfoModal()}>
          <Icon type="info-circle" />About the App
        </Menu.Item>
        <Menu.Item key="app">
          <Icon type="camera" />Home Page
        </Menu.Item>
        <Menu.Item key="favorite">
          <Icon type="star" />Favorite Images
        </Menu.Item>
        </Menu>
      </Header>
        </div>
        <div style = {{paddingTop: '5%'}}>
        <div style = {{paddingTop: '1%', paddingBottom: '2%', textAlign: 'center'}} >
        { (JSON.parse(ls.get("favorites")).length != 0)
        ?<Button type="secondary" htmlType="submit" onClick = {e => this.clearFavorites(e)}> Clear Favorites</Button>
        :<strong> Images you favorite will appear here! </strong>
        }
        </div>
        {favPhotos}
        </div>
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
          <Facebook link= {this.state.nasaData.items[this.state.currentItem].links[0].href} />
          <Google link= {this.state.nasaData.items[this.state.currentItem].links[0].href} />
          </div>
        </Modal>:
        <div/>
        }
        </div>
      )
    }
    var array = []
    return (
      <div className="App">
      <BackTop />
      <div style= {{position: 'fixed', width: '100%', zIndex: 1}}>
      <Header style = {{width: '100%'}}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
      >
      <Menu.Item key="info" onClick= {() => this.showInfoModal()}>
        <Icon type="info-circle" />About the App
      </Menu.Item>
      <Menu.Item key="app">
        <Icon type="camera" />Home Page
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="star" />Favorite Images
      </Menu.Item>
      </Menu>
      <Search style={{ width: "30%", textAlign: 'center'}}  placeholder="Search" id = "search" onPressEnter={e => this.search(e)} onChange={e => this.handleUserInput(e)} />
    </Header>
      </div>
      <div className= "SearchForm"   style = {{paddingTop: '8%', zIndex: 2}}>
      <div className= "MoreOptions" style = {{paddingLeft: "35.4%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: "45%"}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <div><strong>Search by Start Year and/or End Year</strong></div>
          <br/>
          <Search style={{ width: "95%"}} type="number"  placeholder="Start Year" id= "startYear" onChange={e => this.handleUserInput(e)}/>
          <Search style={{ width: "95%"}} type="number" placeholder="End Year" id= "endYear" onChange={e => this.handleUserInput(e)}/>
          <div><strong>Search by NASA Centers</strong></div>
          <br/>
          <Select defaultValue="All" style={{ width: "95%"}} options={options} id = "center">
          {centers}
          </Select>
          </Col>
        </Panel>
        <Panel header="Most Recent Searches" key="3">
          <Col>
          </Col>
          {(ls.get("searchHistory") != null)
          ?<List
            header={<div><strong>Click Item to Search</strong></div>}
             size="small"
             dataSource={JSON.parse(ls.get("searchHistory")).reverse().slice(0,5)}
             renderItem={item => (
               <List.Item style = {{cursor: "pointer"}} value = {item}  onClick = {() => this.onClick(item)}>{item}</List.Item>
             )}
           />:
           <div></div>
         }
          <Button  type="secondary" htmlType="submit" onClick = {e => this.clearSearch(e)}> Clear Search History </Button>
        </Panel>
        <Panel header="Sort Results" key="2">
          <Col>
          <Select defaultValue="None" style={{ width: "95%", paddingBottom: "2%"}} id = "sort" onChange={this.handleChange} >
          {sorts}
          </Select>
          <div style = {{paddingBottom: "2%"}}>
          <Button  type="primary" htmlType="submit" onClick = {e => this.sortData(e)} >Update Search</Button>
          </div>
          <Button  type="secondary" htmlType="submit"onClick = {e => this.clearSort(e)} >Clear Options</Button>
          </Col>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" onClick = {e => this.search(e)}> Submit </Button>
      </div>
      <div className = "photoGrid">
      {photos}
      </div>
      {(this.state.nasaData != "" && this.state.nasaData != "null" && this.state.nasaData.metadata.total_hits != 0)
      ?<Modal
        id= "visible"
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
        <br/>
        <Facebook link= {this.state.nasaData.items[this.state.currentItem].links[0].href} />
        <Google link= {this.state.nasaData.items[this.state.currentItem].links[0].href} />
        </div>
      </Modal>:
      <div></div>
      }
      <Modal
      id= "infoVisible"
      visible={this.state.infoVisible}
      onOk={this.handleInfoOk}
      onCancel={this.handleInfoCancel}
      title = "About the App">
      <h4> Built with: </h4>
        <ul>
          <li>React.js - Javascript Library used</li>
          <li>NASA Image and Video Library - NASA API</li>
          <li>Ant Design - React UI Framework Used</li>
          <li>Heroku - Used for Application Deployment</li>
        </ul>
        <h4> Author: <a href="https://github.com/DeepakG123">Deepak Goel</a> </h4>
        <h4> <a href="https://github.com/DeepakG123/CapitalOneMindsumo">Github Repository</a> </h4>
      </Modal>
      </div>
    );
  }
}

export default App;
