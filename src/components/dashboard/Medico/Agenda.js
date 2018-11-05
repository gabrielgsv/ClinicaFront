import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import {
  Modal,
  Tooltip,
  Icon,
  Layout,
  Row,
  Col,
  DatePicker,
  Popconfirm,
  Button,
  notification,
  Table
} from "antd";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import axios from "axios";
import { API_ROOT } from "../../../api-config";

const { Content, Sider } = Layout;
const ButtonGroup = Button.Group;
class Agenda extends Component {
  state = {
    dadosUsuario: {
      codigo: "",
      nome: "",
      role: ""
    },
    consulta: {
      estadoModal: false,
      titulo: "Consulta",
      motivo: "",
      medico: "M1",
      area: "A1",
      prescricao: "",
      horario: "H1",
      status: "S1"
    },
    data: "",
    listaAgenda: [],
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
          tokenUser: response.data.token,
          dataSelecionada: ""
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
      .then(() => { })
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

  onModalOpen = () => {
    this.setState({ modalConsulta: true });
  };

  fecharModal = () => {
    this.setState({ modalConsulta: false });
  };

  onChange = (date, dateString) => {
    console.log(dateString)
    axios
      .get(`${API_ROOT}/api/medico/painelagenda/${dateString}/${this.state.dadosUsuario.codigo}`)
      .then(response => {
        this.setState({
         loading: true,
         dataSelecionada: dateString
        })
        setTimeout(() => {
          this.setState({ listaAgenda: response.data, loading: false})
        }, 1000)
      })
      .catch(err => {
        console.log(err)
      })
  }

  verificarAgenda = () => {
    if (this.state.listaAgenda == null)
      return
    else
      return "this.state.listaAgenda.codigo"
  }

  cancelarConsulta = (codigoagendamento) => {
    axios
        .post(`${API_ROOT}/api/cancelarconsulta/${codigoagendamento}`)
        .then(response => {
          this.onChange(this.state.dataSelecionada,this.state.dataSelecionada)
          setTimeout(() => {
            notification.open({
              message: "Cancelamento consulta",
              description: "Consulta cancelada com sucesso !",
              icon: <Icon type="check" style={{ color: "red" }} />
            });
          }, 1000)
        })
        .catch(err => {
          console.log(err)
        })
  }

  render() {
    const abaSelecionada = this.props.abaLateral;
    const a = <span>Aguardando</span>;
    const f = <span>Finalizado</span>;
    const c = <span>Cancelado</span>;
    const verificar = <span>Verificar</span>;
    const cancelar = <span>Cancelar</span>;

    const columns = [
      {
        title: "Paciente",
        dataIndex: "nomepaciente"
      },
      {
        title: "Email",
        dataIndex: "email"
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
      { 
        title: "Cancelar",
        render: (status,agendamento) => {
          return (
            <div className={status.status === "c" ? "btn_cancelarconsulta" : ""}>
            <Tooltip placement="right" title="Cancelar consulta">
              <Popconfirm
                    placement="topLeft"
                    title="Deseja realmente cancelar esta consulta ?"
                    onConfirm={() => this.cancelarConsulta(agendamento.codigo)}
                    okText="Sim"
                    cancelText="Não">
              <ButtonGroup>
                <Button type="danger" icon="close" />
              </ButtonGroup>
            </Popconfirm>
            </Tooltip>
            </div>
            )
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
          <Row
            className="topo-conteudo"
            type="flex"
            style={{ paddingLeft: "50px" }}
          >
            <div className="descricao-pagina">Consultar Agenda</div>
          </Row>
          <Content className="conteudo_principal">
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
              <p>Motivo: {this.state.consulta.motivo} </p>
              <p>Área: {this.state.consulta.area}</p>
              <p>Prescrição: {this.state.consulta.prescricao} </p>
              <p>Horário: {this.state.consulta.horario}</p>
              <p>Status: {this.state.consulta.status}</p>
            </Modal>
            <div className="data_picker">
              <DatePicker onChange={this.onChange.bind(this)} />
            </div>
            <Row
              type="flex"
              justify="center"
              style={{
                textAlign: "center",
                marginBottom: 100,
                paddingTop: 50
              }}
            >
              <Col span={24} sm={24} md={20} lg={14} xl={14}>
                <div>
                  <Table
                    locale={{ emptyText: 'Nenhum Agendamento Cadastrado' }}
                    columns={columns}
                    loading={this.state.loading}
                    dataSource={this.state.listaAgenda}
                    rowKey={this.verificarAgenda}
                    size="middle" />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Agenda;
