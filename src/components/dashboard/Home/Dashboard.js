import React, { Component } from "react";
import { Redirect } from "react-router";
import {
  Card,
  Layout,
  Row,
  Col,
  Table,
  Icon,
  Button,
  Tooltip,
  Modal,
  notification
} from "antd";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import axios from "axios";
import { API_ROOT } from "../../../api-config";

const { Content, Sider } = Layout;

class Dashboard extends Component {
  state = {
    dadosUsuario: {
      codigo: "",
      nome: "",
      role: "",
      totalAgendamentoDia: 0,
      totalAgendamento: 0
    },
    tokenUser: "",
    redirect: false,
    listaAgenda: []
  };

  componentDidMount = () => {
    axios
      .get(`${API_ROOT}/api/recuperartoken`)
      .then(response => {
        console.log(response)
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
      .then(() => {
        this.agendaHoje();
      })
      .catch(() => {
        this.setState({ redirect: true });
        this.redirectLogin();
      });
  }

  agendaHoje = () => {
    var roleRota = this.state.dadosUsuario.role == "m" ? "medico" : "paciente"
    axios
      .get(`${API_ROOT}/api/${roleRota}/agenda/${this.state.dadosUsuario.codigo}`)
      .then(response => {
        this.setState({
          loading: true,
        });
        setTimeout(() => {
          this.setState({ listaAgenda: response.data, loading: false})
        }, 1000)
      })
      .catch(err => {
        console.log(err);
      });
      axios
        .get(`${API_ROOT}/api/${roleRota}/totalagendasdia/${this.state.dadosUsuario.codigo}`)
        .then(response => {
          this.setState({
            dadosUsuario:{
              ...this.state.dadosUsuario,
              totalAgendamentoDia : response.data.agendamentosdia
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      axios
        .get(`${API_ROOT}/api/${roleRota}/totalagendamentos/${this.state.dadosUsuario.codigo}`)
        .then(response => {
          this.setState({
            dadosUsuario: {
              ...this.state.dadosUsuario,
              totalAgendamento : response.data.totalagendamentos
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
  };

  redirectLogin = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  verificarAgenda = () => {
    if (this.state.listaAgenda == null)
      return
    else 
      return "this.state.listaAgenda.codigo"
  }

  render() {
    const a = <span>Aguardando</span>;
    const f = <span>Finalizado</span>;
    const c = <span>Cancelado</span>;
    const abaSelecionada = this.props.abaLateral;
    const rota = this.state.dadosUsuario.role
    const columns = [
      {
        title: rota == "p" ? "Médico" : "Paciente",
        dataIndex: rota == "p" ? "nomemedico" : "nomepaciente"
      },
      {
        title: rota == "p" ? "Área" : "Email",
        dataIndex: rota == "p" ? "especializacao" : "email"
      },
      {
        title: "Horário",
        render: hora => {
          return (
            <div>{hora.hora}:00</div>
          );
        }
      },
      {
        title: "Status",
        render: status => {
          return (
            <Tooltip placement="right" title={status.status === "a" ? a : (status.status === "f" ? f : c)}>
              <Icon
                className={
                  status.status === "a"
                    ? "icones_agenda_status_esperando" :
                    (status.status === "f" ? "icones_agenda_status_finalizado" : "icones_agenda_status_cancelado")}
                type={status.status === "a" ? "loading" : (status.status === "f" ? "check" : "close")}
              />
            </Tooltip>
          );
        }
      },
    ];
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
              <div className="descricao-pagina">Página Inicial</div>
            </Col>
          </Row>
          <Content  className="conteudo_home">
            <Row
              className="row_cards_home"
              gutter={48}
              type="flex"
              justify="center"
            >
              <Card
                className="card_home"
                style={{
                  paddingLeft: 40,
                  paddingRight: 40
                }}
              >
                <Col span={7}>
                  <img
                    className="imagem_card_home"
                    src="https://cdn0.iconfinder.com/data/icons/ikooni-outline-free-basic/128/free-28-128.png"
                  />
                </Col>
                <Col className="descricao_card" span={14}>
                  <p className="valor_card">{this.state.dadosUsuario.totalAgendamento}</p>
                  <p className="descricao_card"> Total </p>
                </Col>
              </Card>
              <Card className="card_home">
                <Col span={7}>
                  <img
                    className="imagem_card_home"
                    src="https://cdn0.iconfinder.com/data/icons/ikooni-outline-free-basic/128/free-20-512.png"
                  />
                </Col>
                <Col className="descricao_card" span={14}>
                  <p className="valor_card">{this.state.dadosUsuario.totalAgendamentoDia}</p>
                  <p className="descricao_card">Agendados</p>
                </Col>
              </Card>
            </Row>
          </Content>
          <Row
            type="flex"
            justify="center"
            style={{
              textAlign: "center",
              marginBottom: 100
            }}
          >
            <Col span={22} sm={20} md={20} lg={14} xl={14}>
              <div>
                <div className="descricao-pagina">Agenda de hoje</div>
                <Table
                  locale={{ emptyText: 'Nenhum Agendamento Cadastrado' }}
                  columns={columns}
                  loading={this.state.loading}
                  dataSource={this.state.listaAgenda}
                  rowKey={this.verificarAgenda}
                  size="middle"
                />
              </div>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
