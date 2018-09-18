import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import {
  Layout,
  Row,
  Col,
  Steps,
  Button,
  Input,
  Modal,
  Icon,
  Card,
  Table,
  TimePicker,
  Tooltip,
  DatePicker,
  Form,
  Select,
  Popconfirm,
  notification
} from "antd";

import "../Dashboard.css";

import CardMedico from "../Medico/CardMedico";

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import axios from "axios";
import moment from "moment";
import { API_ROOT } from "../../../api-config";
import { height } from "window-size";

const Option = Select.Option;
const FormItem = Form.Item;
const { Content, Sider } = Layout;
const { Meta } = Card;
const { TextArea } = Input;
const Step = Steps.Step;
const Search = Input.Search;
const format = "HH:00";

class NovaConsulta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dadosUsuario: {
        codigo: "",
        nome: "",
        role: ""
      },
      etapa: 0,
      statusMedico: false,
      statusData: false,
      statusConfirmar: false,
      estadoModal: false,
      tokenUser: "",
      redirect: false,
      nomebutton: "Buscar",
      nomedigitado: {
        nome: ""
      },
      medico: {
        especializacao: ""
      },
      medicos: [],
      medicoSelecionado: [],
      medicosBuscados: [],
      horas: [], // 7, 8, 9, 10, 11, 13, 14, 15, 16, 17
      agendamento: [],
      alergias: ""
    };
  }

  componentDidMount = () => {
    this.setState({ etapa: 0 });
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

  redirectAgenda = () => {
    if (this.state.redirect) {
      return <Redirect to="/agendapaciente" />;
    }
  };

  onModalOpen = () => {
    this.setState({ estadoModal: true });
  };

  fecharModal = () => {
    this.setState({ estadoModal: false });
  };

  voltarMedico = () => {
    this.setState({
      etapa: this.state.etapa - 1,
      medicosBuscados: [],
      medico: {
        especializacao: ""
      }
    });
    this.setState({
      statusMedico: false
    });
  };

  voltarData = () => {
    this.setState({
      etapa: this.state.etapa - 1
    });
    this.setState({
      statusData: false
    });
  };

  escolherMedico = () => {
    this.setState({ estadoModal: false });
    this.setState({
      etapa: this.state.etapa + 1
    });
    this.setState({
      statusMedico: true
    });
  };

  escolherData = () => {
    this.setState({
      etapa: this.state.etapa + 1
    });
    this.setState({
      statusData: true
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
        console.log(response.data);
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

  etapaMedico = (codigo, nome) => {
    notification.open({
      message: `${nome}`,
      description: "Selecionado com sucesso :)",
      icon: <Icon type="smile" style={{ color: "blue" }} />
    });
    this.setState({
      agendamento: {
        codigomedico: codigo,
        nomemedico: nome
      },
      etapa: this.state.etapa + 1,
      statusMedico: true
    });
  };

  onHorario = (time, timeString) => {
    let horaInt = parseInt(timeString);
    this.setState({
      agendamento: {
        ...this.state.agendamento,
        horainicio: horaInt,
        horafim: horaInt + 0.9
      }
    });
  };

  buscarHorario = () => {
    this.setState({
      nomebutton: "Buscando",
      loading: true
    });
    setTimeout(() => {
      this.setState({ loading: false, nomebutton: "Buscar" });
      axios
        .post(
          `${API_ROOT}/api/medico/horariosdisponiveis`,
          this.state.agendamento
        )
        .then(response => {
          this.etapaHorario();
        })
        .catch(err => {
          notification.open({
            message: "Data e horario",
            description: "Horários estão ocupados :(",
            icon: <Icon type="meh-o" style={{ color: "red" }} />
          });
        });
    }, 1500);
  };

  alergias = value => {
    this.setState({
      alergias: value
    });

    let alergiasPaciente = this.state.alergias;
    let alergiasP = alergiasPaciente.toString();

    this.setState({
      agendamento: {
        ...this.state.agendamento,
        alergias: alergiasP
      }
    });
  };

  descricaoConsulta = e => {
    this.setState({
      agendamento: {
        ...this.state.agendamento,
        codigopaciente: this.state.dadosUsuario.codigo,
        motivo: e.target.value
      }
    });
  };

  etapaHorario = () => {
    notification.open({
      message: "Data e horario",
      description: "Selecionado com sucesso :)",
      icon: <Icon type="smile" style={{ color: "blue" }} />
    });
    this.setState({
      etapa: this.state.etapa + 1,
      statusData: true,
      nomebutton: "Confirmar"
    });
  };

  confirmarConsulta = () => {
    axios
      .post(`${API_ROOT}/api/novaconsulta`, this.state.agendamento)
      .then(response => {
        console.log(response);
        this.setState({
          statusConfirmar: true,
          nomebutton: "Confirmando consulta",
          loading: true
        });
        setTimeout(() => {
          this.setState({ loading: false, redirect: true });
          this.redirectAgenda();
          notification.open({
            message: "Agendamento de consulta.",
            description: "Consulta agendada com sucesso !",
            icon: <Icon type="check" style={{ color: "green" }} />
          });
        }, 1500);
      })
      .catch(err => {
        console.log(err);
      });
  };

  onModalOpen = () => {
    this.setState({ estadoModal: true });
  };

  fecharModal = () => {
    this.setState({ estadoModal: false });
  };

  alterarMedico = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, estadoModal: false });
    }, 1000);
  };

  buscarHoras = (date, dateString) => {
    this.setState({
      agendamento: {
        ...this.state.agendamento,
        data: dateString,
        loading: true
      },
    }, () => {
      axios.get(`${API_ROOT}/api/medico/horariosdisponiveis/${this.state.agendamento.data}/${this.state.agendamento.codigomedico}`)
        .then(() => {
          this.setState({
            horas: response.data
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  render() {
    const selecionarMedico = <span>Selecionar Medico</span>;
    const textoConfirmacao = <span>Deseja confirmar esta consulta ?</span>;
    const abaSelecionada = this.props.abaLateral;
    var conteudo;
    const Medicos = this.state.medicosBuscados;

    var dadosSelecionados;
    dadosSelecionados = (
      <div style={{ position: "absolute" }}>
        <div style={{ fontSize: 17 }}>
          <Icon
            style={{
              marginLeft: 20,
              marginTop: 20,
              marginRight: 15,
              color: "black"
            }}
            type="user"
            theme="outlined"
          />
          <span>{this.state.agendamento.nomemedico}</span>
        </div>
        <div style={{ fontSize: 17 }}>
          <Icon
            style={{
              marginLeft: 20,
              marginTop: 20,
              marginRight: 15,
              color: "black"
            }}
            type="clock-circle"
            theme="outlined"
          />
          <span>{this.state.agendamento.data}</span>
        </div>
        <div style={{ fontSize: 17 }}>
          <Icon
            style={{
              marginLeft: 20,
              marginTop: 20,
              marginRight: 15,
              color: "black"
            }}
            type="minus"
            theme="outlined"
          />
          <span>
            {this.state.agendamento.horainicio}
            HS
          </span>
        </div>
      </div>
    );

    if (this.state.etapa === 0) {
      conteudo = (
        <div>
          <Row type="flex" justify="center">
            <Content className="conteudo_principal">
              <Row
                type="flex"
                align="center"
                style={{ paddingBottom: "20px" }}
              />
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
                        <Tooltip placement="bottom" title={selecionarMedico}>
                          <Icon
                            type="check"
                            onClick={() =>
                              this.etapaMedico(medico.codigo, medico.nome)
                            }
                          />
                        </Tooltip>
                      ]}
                    >
                      <Meta
                        className="descricoes_card_nome"
                        title={medico.nome}
                      />
                    </Card>
                  );
                })}
              </Row>
            </Content>
          </Row>
        </div>
      );
    } else if (this.state.etapa === 1) {
      conteudo = (
        <div className="conteudo_principal">
          {dadosSelecionados}
          <Row type="flex" justify="center">
            <div className="header_selecionar_horario">
              Selecione uma data e horário
            </div>
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <div style={{ marginBottom: "20px" }} className="data_picker">
                <DatePicker size="large" onChange={this.buscarHoras} />
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="center" >
            <div style={{ width: "400px", marginLeft: "30px" }}>
              {this.state.horas.map((horas) =>
                <Col span={3} style={{ margin: "15px" }} >
                  <div loading={this.state.loading} style={{ backgroundColor: "#42b6a5", height: "50px", borderRadius: "8px", color: "white", textAlign: "center", paddingTop: "13px" }}>{this.state.horas}00</div>
                </Col>
              )}
            </div>
          </Row>
          <div>
            <Col pull="24" style={{ paddingTop: 20, paddingLeft: 50 }}>
              <Button type="primary" onClick={this.voltarMedico}>
                Voltar
              </Button>
            </Col>
          </div>
        </div>
      );
    } else if (this.state.etapa === 2) {
      conteudo = (
        <div className="conteudo_principal">
          {this.redirectAgenda()}
          {dadosSelecionados}
          <Row type="flex" justify="center">
            <Col span={24} lg={12} xl={12}>
              <Form>
                <Row justify="center" type="flex">
                  <div className="descricao-consulta">Descrição</div>
                </Row>
                <Row type="flex" justify="center">
                  <div className="header_descricao_consulta">
                    Conte-me em detalhes do que está sentindo
                  </div>
                </Row>
                <FormItem>
                  <TextArea
                    placeholder="O que você está sentindo ?"
                    autosize={{ minRows: 2, maxRows: 6 }}
                    onChange={this.descricaoConsulta}
                  />
                  <Row type="flex" justify="center">
                    <div className="header_descricao_consulta">
                      Suas alergias
                    </div>
                  </Row>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Alergias"
                    onChange={this.alergias}
                  />
                </FormItem>
                <FormItem />
                <FormItem>
                  <Popconfirm
                    placement="topLeft"
                    title={textoConfirmacao}
                    onConfirm={this.confirmarConsulta}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button loading={this.state.loading}>
                      {this.state.nomebutton}
                    </Button>
                  </Popconfirm>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <div>
            <Col pull="24" style={{ paddingTop: 20, paddingLeft: 50 }}>
              <Button type="primary" onClick={this.voltarData}>
                Voltar
              </Button>
            </Col>
          </div>
        </div>
      );
    }

    return (
      <Layout>
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
              <div className="descricao-pagina">Nova Consulta</div>
            </Col>
          </Row>
          <Content className="conteudo_principal">
            <div style={{ margin: "20px" }}>
              <Steps current={this.state.etapa}>
                <Step
                  title="Selecionar Medico"
                  icon={
                    this.state.statusMedico ? (
                      <Icon type="user" />
                    ) : (
                        <Icon type="loading" />
                      )
                  }
                />
                <Step
                  title="Selecionar Data e Hora"
                  icon={
                    this.state.statusData ? (
                      <Icon type="hourglass" />
                    ) : (
                        <Icon type="loading" />
                      )
                  }
                />
                <Step
                  title="Confirmar Consulta"
                  icon={
                    this.state.statusConfirmar ? (
                      <Icon type="check" />
                    ) : (
                        <Icon type="loading" />
                      )
                  }
                />
              </Steps>
            </div>
            <div>
              <div>
                <Row type="flex" justify="center">
                  <Modal
                    className="modal_consulta"
                    title={this.state.medico.nome}
                    visible={this.state.estadoModal}
                    onCancel={this.fecharModal}
                    footer={[
                      <Button
                        key="submit"
                        type="primary"
                        onClick={this.escolherMedico}
                      >
                        Selecionar
                      </Button>,
                      <Button key="back" onClick={this.fecharModal}>
                        <Icon type="left" />
                        Retornar
                      </Button>
                    ]}
                  >
                    <p>Área: {this.state.medico.area}</p>
                    <p>Horário: {this.state.medico.idade}</p>
                    <p>Status: {this.state.medico.anos_atuacao}</p>
                  </Modal>
                  <Col pull={0} sm={22} md={10} lg={24} xl={24}>
                    {conteudo}
                  </Col>
                </Row>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default NovaConsulta;
