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
      role: ""
    },
    tokenUser: "",
    redirect: false,
    consulta: {
      estadoModal: false,
      titulo: "Consulta",
      medico: "M1",
      area: "A1",
      horario: "H1",
      status: "S1"
    },
    listaAgenda: []
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
      .then(() => {
        this.agendaHoje();
      })
      .catch(() => {
        this.setState({ redirect: true });
        this.redirectLogin();
      });
  }

  agendaHoje = () => {
    axios
      .get(`${API_ROOT}/api/paciente/agenda/${this.state.dadosUsuario.codigo}`)
      .then(response => {
        this.setState({
          listaAgenda: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  redirectLogin = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  onModalOpen = () => {
    this.setState({ modalConsulta: true });
  };

  fecharModal = () => {
    this.setState({ modalConsulta: false });
  };

  render() {
    const a = <span>Aguardando</span>;
    const f = <span>Finalizado</span>;
    const c = <span>Cancelado</span>;
    const verificar = <span>Verificar</span>;
    const Agenda = this.state.listaAgenda;
    const abaSelecionada = this.props.abaLateral;

    const columns = [
      {
        title: "Médico",
        dataIndex: "nomemedico"
      },
      {
        title: "Área",
        dataIndex: "especializacao"
      },
      {
        title: "Horário",
        dataIndex: "hora"
      },

      // <Tooltip placement="right" title={f}>
      //       <Icon
      //         className={
      //           this.state.listaAgenda.status === "a"
      //             ? "icones_agenda_status_finalizado"
      //             : "icones_agenda_status_esperando"
      //         }
      //         type=""
      //       />
      //     </Tooltip>

      {
        title: "Status",
        render: status => {
          return (
            <Tooltip placement="right" title={status.status}>
              <Icon
                className={
                  status.status === "a"
                    ? "icones_agenda_status_esperando"
                    : "icones_agenda_status_finalizado"
                }
                type={status.status === "a" ? "loading" : "check"}
              />
            </Tooltip>
          );
        }
      },
      {
        title: "Ação",
        render: acao => (
          <Tooltip placement="right" title={verificar}>
            <Button
              type="primary"
              icon="up-square"
              onClick={this.onModalOpen}
            />
          </Tooltip>
        )
      }
    ];

    const data = [
      //   {
      //     key: "1",
      //     medico: Agenda.nomemedico,
      //     area: Agenda.especializacao,
      //     horario: Agenda.hora
      //     status: (
      //       <Tooltip placement="right" title={a}>
      //         <Icon className="icones_agenda_status_esperando" type="loading" />
      //       </Tooltip>
      //     ),
      //     acao: (
      //       <Tooltip placement="right" title={verificar}>
      //         <Button
      //           type="primary"
      //           icon="up-square"
      //           onClick={this.onModalOpen}
      //         />
      //       </Tooltip>
      //     )
      //   }
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
          <Content className="conteudo_home">
            <Modal
              className="modal_consulta"
              title={this.state.consulta.titulo}
              visible={this.state.modalConsulta}
              onCancel={this.fecharModal}
              footer={[
                <Button key="back" onClick={this.fecharModal}>
                  <Icon type="left" />
                  Retornar
                </Button>
              ]}
            >
              <p>Médico: {this.state.consulta.medico} </p>
              <p>Área: {this.state.consulta.area}</p>
              <p>Horário: {this.state.consulta.horario}</p>
              <p>Status: {this.state.consulta.status}</p>
            </Modal>
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
                  <p className="valor_card">0</p>
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
                  <p className="valor_card">0</p>
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
                  columns={columns}
                  dataSource={this.state.listaAgenda}
                  rowKey={this.state.listaAgenda.codigo}
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
