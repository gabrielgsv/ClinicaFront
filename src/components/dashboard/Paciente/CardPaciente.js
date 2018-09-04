import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Icon,
  Tooltip,
  Input,
  DatePicker,
  notification,
  Select,
  Layout
} from "antd";

import "../Dashboard.css";
import moment from "moment";
import axios from "axios";
import { API_ROOT } from "../../../api-config"


const Option = Select.Option;

const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

class CardPaciente extends Component {
  state = {
    loading: false,
    estadoModalVer: false,
    estadoModalAlterar: false,
    nomedigitado: {
      nome: ""
    },
    pacientes: [],
    pacienteSelecionado: [],
    pacientesBuscados: []
  };

  onChangeBuscarPaciente = e => {
    this.setState({
      nomedigitado: {
        nome: e.target.value
      }
    });
    console.log(this.state.nomedigitado);
  };

  pacienteBuscando = () => {
    console.log(this.state.nomedigitado);
    axios
      .post(`${API_ROOT}/api/buscarpaciente`, this.state.nomedigitado)
      .then(response => {
        if (response.data.length === 0) {
          notification.open({
            message: "Localizar Paciente",
            description: "Não existe este paciente :(",
            icon: <Icon type="meh-o" style={{ color: "red" }} />
          });
          this.setState({
            nomedigitado: {
              nome: ""
            },
            pacientesBuscados: response.data
          });
          return;
        }
        this.setState({
          pacientesBuscados: response.data,
          loading: true
        });
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 1000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  abrirModalEditar = key => {
    if (this.props.role === "p") {
      notification.open({
        message: "Editar Paciente",
        description: "Você não tem permissão de acesso !",
        icon: <Icon type="close" style={{ color: "red" }} />
      });
      return;
    }
    const paciente = this.state.pacientesBuscados.find(paciente => {
      return paciente.codigo === key;
    });
    this.setState({ pacienteSelecionado: paciente });
    this.setState({ estadoModalAlterar: true });
  };

  abrirModalVer = key => {
    const paciente = this.state.pacientesBuscados.find(paciente => {
      return paciente.codigo === key;
    });
    this.setState({ pacienteSelecionado: paciente });
    this.setState({ estadoModalVer: true });
  };

  fecharModalVer = () => {
    this.setState({ estadoModalVer: false });
  };

  fecharModalAlterar = () => {
    this.setState({ estadoModalAlterar: false });
  };

  deletarPaciente = () => {
    if (this.props.role === "p") {
      notification.open({
        message: "Deletar Paciente",
        description: "Você não tem permissão de acesso !",
        icon: <Icon type="close" style={{ color: "red" }} />
      });
      return;
    }
    notification.open({
      message: `${this.state.novoPaciente.nome}`,
      description: "Paciente deletado com sucesso !",
      icon: <Icon type="close" style={{ color: "red" }} />
    });
  };

  onDataNascimento = (date, dateString) => {
    this.setState({
      pacienteSelecionado: {
        ...this.state.pacienteSelecionado,
        data_nascimento: dateString
      }
    });
  };

  alterandoPaciente = e => {
    this.setState({
      pacienteSelecionado: {
        ...this.state.pacienteSelecionado,
        [e.target.name]: e.target.value
      }
    });
  };

  escolherHospital = value => {
    this.setState({
      pacienteSelecionado: {
        ...this.state.pacienteSelecionado,
        hospital: value
      }
    });
  };

  escolherStatus = value => {
    this.setState({
      pacienteSelecionado: {
        ...this.state.pacienteSelecionado,
        ativo: value
      }
    });
  };

  alterarPaciente = () => {
    console.log(this.state.pacienteSelecionado);
    axios
      .post(`${API_ROOT}/api/alterarpaciente`, this.state.pacienteSelecionado)
      .then(response => {
        this.pacienteBuscando();
        setTimeout(() => {
          notification.open({
            message: `${response.data.nome}`,
            description: "Paciente alterado com sucesso !",
            icon: <Icon type="edit" style={{ color: "blue" }} />
          });
        }, 1000);
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, estadoModalAlterar: false });
    }, 1000);
  };

  render() {
    const Pacientes = this.state.pacientesBuscados;
    const alterarPacienteToolTip = <span>Modificar Paciente</span>;
    const verPacienteToolTip = <span>Visualizar Informações</span>;
    const deletarPacienteToolTip = <span>Deletar Paciente</span>;
    // const textoConfirmacao = (
    //   <span>Deseja realmente excluir este paciente ?</span>
    // );
    let btnAdicionarPaciente;
    if (this.props.role === "m") {
      btnAdicionarPaciente = (
        <Button
          className="btn_custom_primary"
          type="primary"
          style={{ textTransform: "uppercase" }}
        >
          Adicionar novo paciente
          <Icon type="plus" />
        </Button>
      );
    }

    return (
      <Row type="flex" justify="center" className="cards_paciente">
        {/* Modal para visualizar paciente */}
        <Modal
          className="modal_paciente"
          title={this.state.pacienteSelecionado.nome}
          visible={this.state.estadoModalVer}
          onCancel={this.fecharModalVer}
          footer={[
            <Button key="back" onClick={this.fecharModalVer}>
              <Icon type="left" />
              Retornar
            </Button>
          ]}
        >
          <div className="descricao_paciente">
            <p>Email: {this.state.pacienteSelecionado.email}</p>
            <p>
              Hospital Conveniado: {this.state.pacienteSelecionado.hospital}
            </p>
            <p>Número carteira: {this.state.pacienteSelecionado.carteira}</p>
            <p>
              Data Nascimento: {this.state.pacienteSelecionado.data_nascimento}
            </p>
            <p>
              Status:{" "}
              {this.state.pacienteSelecionado.ativo === "a"
                ? "Ativo"
                : "Inativo"}
            </p>
          </div>
        </Modal>
        {/* Fim Modal para visualizar paciente */}
        {/* Modal para editar paciente */}
        <Modal
          className="modal_paciente"
          title="Alterando Paciente"
          visible={this.state.estadoModalAlterar}
          onCancel={this.fecharModalAlterar}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.alterarPaciente}
            >
              Salvar alterações
            </Button>,
            <Button key="back" onClick={this.fecharModalAlterar}>
              <Icon type="left" />
              Retornar
            </Button>
          ]}
        >
          <div className="descricao_paciente">
            <Input
              addonBefore="Nome"
              name="nome"
              onChange={this.alterandoPaciente}
              value={this.state.pacienteSelecionado.nome}
            />
            <Input
              addonBefore="Email"
              name="email"
              onChange={this.alterandoPaciente}
              value={this.state.pacienteSelecionado.email}
            />
            <div className="labelNascimento">
              NASCIMENTO{" "}
              <DatePicker
                style={{ paddingLeft: 10 }}
                name="data_nascimento"
                onChange={this.onDataNascimento}
                defaultValue={moment(
                  this.state.pacienteSelecionado.data_nascimento
                )}
              />
            </div>
            <div className="labelNascimento">
              HOSPITAL{" "}
              <Select
                style={{ paddingLeft: 35 }}
                value={this.state.pacienteSelecionado.hospital}
                name="hospital"
                onChange={this.escolherHospital}
                placeholder="Por favor escolha um Hospital"
              >
                <Option value="unimed">Unimed</Option>
                <Option value="regional">Regional</Option>
                <Option value="hospitaldocoracao">Hospital Do Coração</Option>
                <Option value="hospitaldocancer">Hospital Do Cancer</Option>
              </Select>
            </div>
            <Input
              addonBefore="Carteirinha"
              name="carteira"
              onChange={this.alterandoPaciente}
              value={this.state.pacienteSelecionado.carteira}
            />
            <div className="labelNascimento">
              STATUS{" "}
              <Select
                style={{ paddingLeft: 50 }}
                value={this.state.pacienteSelecionado.ativo}
                name="ativo"
                onChange={this.escolherStatus}
                placeholder="Escolha ums status"
              >
                <Option value="a">Ativo</Option>
                <Option value="i">Inativo</Option>
              </Select>
            </div>
          </div>
        </Modal>
        {/* Fim Modal para editar paciente */}
        <Content className="conteudo_principal">
          <Row
            type="flex"
            align="center"
            style={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            <Col span={24} sm={22} md={5} lg={5} xl={5}>
              <Search
                placeholder="Buscar Paciente"
                onChange={this.onChangeBuscarPaciente}
                onSearch={this.pacienteBuscando}
                value={this.state.nomedigitado.nome}
                enterButton
              />
            </Col>
            <Col span={24} offset={8} sm={22} md={5} lg={5} xl={5}>
              <Link to="/adicionarpaciente">{btnAdicionarPaciente}</Link>
            </Col>
          </Row>
          <Row type="flex" align="center" style={{ marginBottom: 50 }}>
            {Pacientes.map(paciente => {
              return (
                <Card
                  loading={this.state.loading}
                  key={paciente.codigo}
                  className="card_paciente"
                  actions={[
                    <Tooltip placement="bottom" title={verPacienteToolTip}>
                      <Icon
                        type="caret-up"
                        onClick={() => this.abrirModalVer(paciente.codigo)}
                      />
                    </Tooltip>,
                    <Tooltip placement="bottom" title={alterarPacienteToolTip}>
                      <Icon
                        type="edit"
                        onClick={() => this.abrirModalEditar(paciente.codigo)}
                      />
                    </Tooltip>
                  ]}
                >
                  <Meta
                    className={
                      paciente.ativo === "i"
                        ? "link_paciente_desabilitado descricoes_card_nome_inativo"
                        : "descricoes_card_nome"
                    }
                    title={paciente.nome}
                  />
                </Card>
              );
            })}
          </Row>
        </Content>
      </Row>
    );
  }
}

export default CardPaciente;
