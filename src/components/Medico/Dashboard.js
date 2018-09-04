import React, { Component } from "react";
import { Layout, Row, Col, Select, Button, Icon } from "antd";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import CardMedico from "./CardMedico";
import axios from "axios";

const { Sider } = Layout;
const Option = Select.Option;
const { Content } = Layout;

class Dashboard extends Component {
  state = {
    dadosUsuario: {
      codigo: "",
      nome: "",
      role: ""
    },
    tokenUser: "",
    loading: false,
    carregarCardMedico: 0,
    nomebutton: "Buscar",
    especializacao: "",
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

  escolherEspecializacao = value => {
    this.setState({
      especializacao: value
    });
  };

  carregarCardMedico = () => {
    if (this.state.especializacao !== "") {
      this.setState({
        carregarCardMedico: 1
      });
    }
  };

  render() {
    const abaSelecionada = this.props.abaLateral;
    let cardMedico;
    if (this.state.carregarCardMedico === 1) {
      console.log("montando componente cardMedico");
      cardMedico = (
        <CardMedico
          especializacao={this.state.especializacao}
          role={this.state.dadosUsuario.role}
        />
      );
    }
    let btnAdicionarMedico;
    if (this.state.dadosUsuario.role === "m") {
      btnAdicionarMedico = (
        <Button
          className="btn_custom_primary"
          type="primary"
          style={{ textTransform: "uppercase" }}
        >
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
