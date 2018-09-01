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
  Button,
  Table
} from "antd";

import "../Dashboard.css";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import ButtonGroup from "../../../../node_modules/antd/lib/button/button-group";
import axios from "axios";

const { Content, Sider } = Layout;
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

  onModalOpen = () => {
    this.setState({ modalConsulta: true });
  };

  fecharModal = () => {
    this.setState({ modalConsulta: false });
  };
  onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  render() {
    const abaSelecionada = this.props.abaLateral;
    const a = <span>Aguardando</span>;
    const f = <span>Finalizado</span>;
    const c = <span>Cancelado</span>;
    const verificar = <span>Verificar</span>;
    const cancelar = <span>Cancelar</span>;

    const columns = [
      {
        title: "Médico",
        dataIndex: "medico"
      },
      {
        title: "Área",
        dataIndex: "area"
      },
      {
        title: "Horário",
        dataIndex: "horario"
      },
      {
        title: "Status",
        dataIndex: "status"
      },
      {
        title: "Ação",
        dataIndex: "acao"
      }
    ];
    const data = [
      {
        key: "1",
        medico: "John Brown",
        area: "Oftalmologista",
        horario: "09:00",
        status: (
          <Tooltip placement="right" title={a}>
            <Icon className="icones_agenda_status_esperando" type="loading" />
          </Tooltip>
        ),
        acao: (
          <ButtonGroup>
            <Tooltip placement="bottom" title={verificar}>
              <Button
                type="primary"
                icon="up-square"
                onClick={this.onModalOpen.bind(this)}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={cancelar}>
              <Button type="primary" icon="close" />
            </Tooltip>
          </ButtonGroup>
        )
      },
      {
        key: "2",
        medico: "John Brown",
        area: "Oftalmologista",
        horario: "09:00",
        status: (
          <Tooltip placement="right" title={f}>
            <Icon className="icones_agenda_status_finalizado" type="check" />
          </Tooltip>
        ),
        acao: (
          <ButtonGroup>
            <Tooltip placement="bottom" title={verificar}>
              <Button
                type="primary"
                icon="up-square"
                onClick={this.onModalOpen.bind(this)}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={cancelar}>
              <Button type="primary" icon="close" />
            </Tooltip>
          </ButtonGroup>
        )
      },
      {
        key: "3",
        medico: "John Brown",
        area: "Oftalmologista",
        horario: "09:00",
        status: (
          <Tooltip placement="bottom" title={c}>
            <Icon className="icones_agenda_status_cancelado" type="close" />
          </Tooltip>
        ),
        acao: (
          <ButtonGroup>
            <Tooltip placement="bottom" title={verificar}>
              <Button
                type="primary"
                icon="up-square"
                onClick={this.onModalOpen.bind(this)}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={cancelar}>
              <Button type="primary" icon="close" />
            </Tooltip>
          </ButtonGroup>
        )
      }
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
              <Button
                type="primary"
                shape="circle"
                icon="search"
                style={{ marginRight: "5px" }}
              />
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
                  <Table columns={columns} dataSource={data} size="middle" />
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="center"
              style={{
                textAlign: "center",
                marginBottom: 100
              }}
            >
              <Button type="primary" style={{ textTransform: "uppercase" }}>
                <Link to={"/novaconsulta"}>
                  Agendar nova consulta
                  <Icon type="right" />
                </Link>
              </Button>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Agenda;
