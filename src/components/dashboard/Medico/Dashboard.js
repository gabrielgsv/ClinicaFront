import React, { Component } from "react";
import { Layout, Row, Col, Input, Button, Icon } from "antd";
import { Redirect } from "react-router";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import CardMedico from "./CardMedico";
import axios from "axios";

const { Sider } = Layout;

class Dashboard extends Component {
  state = {
    dadosUsuario: {
      codigo: "",
      nome: "",
      role: ""
    },
    tokenUser: "",
    redirect: false
  };

  componentDidMount = () => {
    axios
      .get("/api/recuperartoken")
      .then(response => {
        this.setState({
          dadosUsuario: {
            codigo: response.data.codigo,
            nome: response.data.nome,
            role: response.data.role
          },
          tokenUser: response.data.token
        });
        this.validarTokenSessao();
      })
      .catch(() => {
        this.setState({ redirect: true });
        this.redirectLogin();
      });
  };

  validarTokenSessao() {
    axios
      .get("/api/validartoken", {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + this.state.tokenUser
        }
      })
      .then(() => {})
      .catch(() => {
        this.setState({ redirect: true });
        this.redirectLogin();
      });
  }

  redirectLogin = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  render() {
    const abaSelecionada = this.props.abaLateral;
    let btnAdicionarMedico;
    if (this.state.dadosUsuario.role == "m") {
      btnAdicionarMedico = (
        <Button type="primary" style={{ textTransform: "uppercase" }}>
          Adicionar novo médico
          <Icon type="plus" />
        </Button>
      );
    }
    return (
      <Layout>
        {this.redirectLogin()}
        <Sider
          className="topo_menu"
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <MenuLateral
            aba={abaSelecionada}
            nome={this.state.dadosUsuario.nome}
            role={this.state.dadosUsuario.role}
          />
        </Sider>
        <Layout>
          <MenuTopo />
          <Row className="topo-conteudo" type="flex" justify="center">
            <Col span={10}>
              <div className="descricao-pagina">Localizar médico</div>
            </Col>
          </Row>
          <CardMedico role={this.state.dadosUsuario.role} />
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
