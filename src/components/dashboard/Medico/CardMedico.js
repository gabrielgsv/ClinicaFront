import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Icon,
  Popconfirm,
  Tooltip,
  Input,
  Select,
  Layout,
  DatePicker,
  notification
} from "antd";

import "../Dashboard.css";
import moment from "moment";
import axios from "axios";
import { API_ROOT } from "../../../api-config";

const Option = Select.Option;
const { Meta } = Card;
const { Content } = Layout;
const { Search } = Input;

class CardMedico extends Component {
  state = {
    loading: false,
    estadoModalVer: false,
    estadoModalAlterar: false,
    nomebutton: "Buscar",
    medico: {
      especializacao: ""
    },
    medicos: [],
    medicoSelecionado: [],
    medicosBuscados: []
  };

  // onChangeBuscarMedico = e => {
  //   this.setState({
  //     nomedigitado: {
  //       nome: e.target.value
  //     }
  //   });
  // };

  medicoBuscando = () => {
    axios
      .post(`${API_ROOT}/api/buscarmedico`, this.state.nomedigitado)
      .then(response => {
        if (response.data.length === 0) {
          notification.open({
            message: "Localizar Médico",
            description: "Não existe este médico :(",
            icon: <Icon type="meh-o" style={{ color: "red" }} />
          });
          this.setState({
            nomedigitado: {
              nome: ""
            },
            medicosBuscados: response.data
          });
          return;
        }
        this.setState({
          medicosBuscados: response.data,
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
        message: "Editar Médico",
        description: "Você não tem permissão de acesso !",
        icon: <Icon type="close" style={{ color: "red" }} />
      });
      return;
    }
    const medico = this.state.medicosBuscados.find(medico => {
      return medico.codigo === key;
    });
    this.setState({ medicoSelecionado: medico });
    this.setState({ estadoModalAlterar: true });
  };

  abrirModalVer = key => {
    const medico = this.state.medicosBuscados.find(medico => {
      return medico.codigo === key;
    });
    this.setState({ medicoSelecionado: medico });
    this.setState({ estadoModalVer: true });
  };

  fecharModalVer = () => {
    this.setState({ estadoModalVer: false });
  };

  fecharModalAlterar = () => {
    this.setState({ estadoModalAlterar: false });
  };

  deletarMedico = () => {
    if (this.props.prole === "p") {
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
      medicoSelecionado: {
        ...this.state.medicoSelecionado,
        data_nascimento: dateString
      }
    });
  };

  alterandoMedico = e => {
    this.setState({
      medicoSelecionado: {
        ...this.state.medicoSelecionado,
        [e.target.name]: e.target.value
      }
    });
  };

  escolherHospital = value => {
    this.setState({
      medicoSelecionado: {
        ...this.state.medicoSelecionado,
        hospital: value
      }
    });
  };

  escolherStatus = value => {
    this.setState({
      medicoSelecionado: {
        ...this.state.medicoSelecionado,
        ativo: value
      }
    });
  };

  escolherEspecializacao = value => {
    this.setState({
      medico: {
        especializacao: value
      }
    });
  };

  buscarMedico = () => {
    axios
      .post(`${API_ROOT}/api/especializacao`, this.state.medico)
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            loading: true,
            nomebutton: "Buscando",
            medicosBuscados: response.data
          });
        } else {
          this.setState({
            medicosBuscados: response.data
          });
          notification.open({
            message: "Localizar Médico",
            description: "Não existe médicos para essa área :(",
            icon: <Icon type="meh-o" style={{ color: "red" }} />
          });
          return;
        }
        setTimeout(() => {
          this.setState({
            loading: false,
            nomebutton: "Buscar"
          });
        }, 1500);
      })
      .catch(err => {
        console.log(err);
      });
  };

  alterarMedico = () => {
    axios
      .post(`${API_ROOT}/api/alterarmedico`, this.state.medicoSelecionado)
      .then(() => {
        notification.open({
          message: `${this.state.medicoSelecionado.nome}`,
          description: "Médico alterado com sucesso !",
          icon: <Icon type="edit" style={{ color: "blue" }} />
        });
        this.buscarMedico();
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, estadoModalAlterar: false });
    }, 1000);
  };

  // recarregaMedicoSelecionado = () => {
  //   axios
  //     .post(`${API_ROOT}/api/buscarmedico`, this.state.medico)
  //     .then(response => {
  //       this.setState({
  //         medicosBuscados: response.data
  //       });
  //       setTimeout(() => {
  //         notification.open({
  //           message: `${this.state.medico.nome}`,
  //           description: "Médico alterado com sucesso !",
  //           icon: <Icon type="edit" style={{ color: "blue" }} />
  //         });
  //       }, 1000);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  render() {
    const Medicos = this.state.medicosBuscados;
    const alterarMedicoToolTip = <span>Modificar Médico</span>;
    const verMedicoToolTip = <span>Visualizar Informações</span>;

    let btnAdicionarMedico;
    if (this.props.role === "m") {
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
      <div>
        <Row type="flex" justify="center">
          <Modal
            className="modal_consulta"
            title={this.state.medicoSelecionado.nome}
            visible={this.state.estadoModalVer}
            onCancel={this.fecharModalVer}
            footer={[
              <Button key="back" onClick={this.fecharModalVer}>
                <Icon type="left" />
                Retornar
              </Button>
            ]}
          >
            <p>Email: {this.state.medicoSelecionado.email}</p>
            <p>Especialização: {this.state.medicoSelecionado.especializacao}</p>
            <p>Hospital Conveniado: {this.state.medicoSelecionado.hospital}</p>
            <p>Crm: {this.state.medicoSelecionado.crm}</p>
            <p>
              Data Nascimento: {this.state.medicoSelecionado.data_nascimento}
            </p>
            <p>
              Status:{" "}
              {this.state.medicoSelecionado.ativo === "a" ? "Ativo" : "Inativo"}
            </p>
          </Modal>
          <Modal
            className="modal_consulta"
            title="Alterando Médico"
            visible={this.state.estadoModalAlterar}
            onCancel={this.fecharModalAlterar}
            footer={[
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={this.alterarMedico}
              >
                Salvar alterações
              </Button>,
              <Button key="back" onClick={this.fecharModalAlterar}>
                <Icon type="left" />
                Retornar
              </Button>
            ]}
          >
            <Input
              addonBefore="Nome"
              name="nome"
              onChange={this.alterandoMedico}
              value={this.state.medicoSelecionado.nome}
            />
            <Input
              addonBefore="Email"
              name="email"
              onChange={this.alterandoMedico}
              value={this.state.medicoSelecionado.email}
            />
            <Input
              addonBefore="Especialização"
              name="especializacao"
              onChange={this.alterandoMedico}
              value={this.state.medicoSelecionado.especializacao}
            />
            <div className="labelNascimento">
              NASCIMENTO{" "}
              <DatePicker
                style={{ paddingLeft: 10 }}
                name="data_nascimento"
                onChange={this.onDataNascimento}
                defaultValue={moment(
                  this.state.medicoSelecionado.data_nascimento
                )}
              />
            </div>
            <div className="labelNascimento">
              HOSPITAL{" "}
              <Select
                style={{ paddingLeft: 35 }}
                value={this.state.medicoSelecionado.hospital}
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
              addonBefore="Crm"
              name="crm"
              onChange={this.alterandoMedico}
              value={this.state.medicoSelecionado.crm}
            />
            <div className="labelNascimento">
              STATUS{" "}
              <Select
                style={{ paddingLeft: 50 }}
                value={this.state.medicoSelecionado.ativo}
                name="ativo"
                onChange={this.escolherStatus}
                placeholder="Escolha ums status"
              >
                <Option value="a">Ativo</Option>
                <Option value="i">Inativo</Option>
              </Select>
            </div>
          </Modal>
          <Content className="conteudo_principal">
            <Row type="flex" align="center" style={{ paddingBottom: "20px" }} />
            <Row type="flex" justify="center">
              <div className="header_medico">
                Selecione uma das especializações
              </div>
            </Row>
            <Row type="flex" justify="center">
              <Select
                size="large"
                style={{ width: 400 }}
                onChange={this.escolherEspecializacao}
                placeholder="Por favor escolha uma especialização"
              >
                <Option value="oftalmologista">Oftalmologista</Option>
                <Option value="cardiologista">Cardiologista</Option>
                <Option value="neurologista">Neurologista</Option>
                <Option value="pediatra">Pediatra</Option>
                <Option value="ortopedia">Ortopedia</Option>
              </Select>
            </Row>
            <Row type="flex" justify="center">
              <Button
                style={{ marginTop: 15 }}
                className="login-form-button btn-registro-custom"
                size="large"
                type="primary"
                loading={this.state.loading}
                onClick={this.buscarMedico}
                htmlType="submit"
              >
                {this.state.nomebutton}
                <Icon style={{ marginLeft: 11 }} type="search" />
              </Button>
            </Row>
            <Row type="flex" align="center" style={{ marginBottom: 50 }}>
              {Medicos.map(medico => {
                return (
                  <Card
                    loading={this.state.loading}
                    key={medico.codigo}
                    className="card_paciente"
                    actions={[
                      <Tooltip placement="bottom" title={verMedicoToolTip}>
                        <Icon
                          type="caret-up"
                          onClick={() => this.abrirModalVer(medico.codigo)}
                        />
                      </Tooltip>,
                      <Tooltip placement="bottom" title={alterarMedicoToolTip}>
                        <Icon
                          type="edit"
                          onClick={() => this.abrirModalEditar(medico.codigo)}
                        />
                      </Tooltip>
                    ]}
                  >
                    <Meta
                      className={
                        medico.ativo === "i"
                          ? "link_paciente_desabilitado descricoes_card_nome_inativo"
                          : "descricoes_card_nome"
                      }
                      title={medico.nome}
                    />
                  </Card>
                );
              })}
            </Row>
            <Row type="flex" justify="end">
              <Col style={{ paddingRight: 50, paddingBottom: 50 }}>
                <Link to="/adicionarmedico">{btnAdicionarMedico}</Link>
              </Col>
            </Row>
          </Content>
        </Row>
      </div>
    );
  }
}

export default CardMedico;
