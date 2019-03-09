import React, { Component } from 'react';
import './App.css';
import ls from 'local-storage'
import { Input, Button, Col, Card} from 'antd';
import 'antd/dist/antd.css';

class PhotoDisplay extends Component {
  render() {
    console.log("Props: " + this.props.search)
    return (
      <div className="PhotoDisplay">
      <Col span={6} style={{}}>
      </Col>
      </div>
    );
  }
}

export default PhotoDisplay;
