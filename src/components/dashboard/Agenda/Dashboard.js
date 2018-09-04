import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { Card, Layout, Row, Col } from "antd";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import LogoMedico from "../../../assets/medico-logo.jpg";
import LogoPaciente from "../../../assets/paciente-logo.jpg";
import axios from "axios";
import { API_ROOT } from "../../../api-config"


const { Content, Sider } = Layout;

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
      .get(`${API_ROOT}/api/recuperartoken`)
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
      .get(`${API_ROOT}/api/validartoken`, {
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
          <Row
            className="topo-conteudo"
            type="flex"
            style={{ paddingLeft: "50px" }}
          >
            <div className="descricao-pagina">Consultar Agenda</div>
          </Row>
          <Content className="conteudo_principal">
            <Row
              className="row_cards_agenda"
              gutter={48}
              type="flex"
              justify="center"
            >
              <Link
                to={"/agendamedico"}
                className={
                  this.state.dadosUsuario.role === "p"
                    ? "link_agenda_desabilitado"
                    : ""
                }
              >
                <Card className="card_agenda" hoverable>
                  <Col span={7}>
                    <img className="imagens_agenda" src={LogoMedico} />
                  </Col>
                </Card>
                <h2 className="card_titulo_agenda">medico</h2>
              </Link>
              <Link
                to={"/agendapaciente"}
                className={
                  this.state.dadosUsuario.role === "m"
                    ? "link_agenda_desabilitado"
                    : ""
                }
              >
                <Card className="card_agenda" hoverable>
                  <Col span={7}>
                    <img className="imagens_agenda" src={LogoPaciente} />
                  </Col>
                </Card>
                <h2 className="card_titulo_agenda">paciente</h2>
              </Link>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
