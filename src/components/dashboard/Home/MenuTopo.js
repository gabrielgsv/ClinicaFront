import React, { Component } from "react";
import { Layout, Avatar, Row, Col, Menu, Dropdown, Icon } from "antd";
import { Link } from 'react-router-dom'

import "../Dashboard.css";

const { Header } = Layout;

class MenuTopo extends Component {
  state = {
    visible: false
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="2">
          <Link to="/login">
            <Icon type="export" />
              Sair
          </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Header className="cabecalho">
        <Row type="flex" justify="end">
          <Col span={2}>
            <Dropdown
              overlay={menu}
              onVisibleChange={this.handleVisibleChange}
              visible={this.state.visible}
            >
              <a className="ant-dropdown-link" href="">
                <Avatar
                  size="large"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
                <Icon type="down" />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </Header>
    );
  }
}

export default MenuTopo;
