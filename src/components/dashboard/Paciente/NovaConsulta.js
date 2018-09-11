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
  Tooltip,
  DatePicker,
  Form,
  Select,
  Popconfirm,
  notification
} from "antd";

import "../Dashboard.css";

import CardMedico from "../Medico/CardMedico"

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import axios from "axios";
import moment from "moment";
import { API_ROOT } from "../../../api-config"


const Option = Select.Option;
const FormItem = Form.Item;
const { Content, Sider } = Layout;
const { Meta } = Card;
const { TextArea } = Input;
const Step = Steps.Step;
const Search = Input.Search;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
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
      medicosBuscados: []
    };
  }

  handleChange(value) {
    console.log(`selected ${value}`);
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

  onModalOpen = () => {
    this.setState({ estadoModal: true });
  };

  fecharModal = () => {
    this.setState({ estadoModal: false });
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  voltarMedico = () => {
    this.setState({
      etapa: this.state.etapa - 1
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

  confirmarConsulta = () => {
    // message.info("Consulta confimada !!!");
    notification.open({
      message: "Agendamento de consulta.",
      description: "Consulta agendada com sucesso !",
      icon: <Icon type="check" style={{ color: "green" }} />
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

  render() {
    const selecionar = <span>Selecionar</span>;
    const textoConfirmacao = <span>Deseja confirmar esta consulta ?</span>;
    const abaSelecionada = this.props.abaLateral;
    var conteudo;
    const Medicos = this.state.medicosBuscados;

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
        acao: (
          <Tooltip placement="bottom" title={selecionar}>
            <Button type="primary" icon="plus" onClick={this.escolherData} />
          </Tooltip>
        )
      }
    ];

    if (this.state.etapa === 0) {
      conteudo = (
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
                <Icon style={{ marginLeft: 11 }} type="plus" />
              </Button>
            </Row>
            <Row type="flex" align="center" style={{ marginBottom: 50 }}>
              {Medicos.map(medico => {
                return (
                  <Card
                    loading={this.state.loading}
                    key={medico.codigo}
                    className="card_paciente"
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
        <div>
          <div className="data_picker">
            <Button
              type="primary"
              shape="circle"
              icon="search"
              style={{ marginRight: 5, marginBottom: 20, marginLeft: 40 }}
            />
            <DatePicker format="DD-MM-YYYY" onChange={this.onChange} />
          </div>
          <div style={{ minWidth: "500px", marginLeft: -50 }}>
            <Table columns={columns} dataSource={data} size="middle" />
          </div>
          <div>
            <Col pull="24" style={{ paddingTop: "150px" }}>
              <Button type="primary" onClick={this.voltarMedico}>
                Voltar
              </Button>
            </Col>
          </div>
        </div>
      );
    } else if (this.state.etapa === 2) {
      conteudo = (
        <div>
          <Form>
            <Row justify="center" type="flex">
              <div className="descricao-consulta">Descrição</div>
            </Row>
            <FormItem>
              <TextArea placeholder="Detalhes" rows={5} />

              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Alergias"
                onChange={this.handleChange}
              >
                {children}
              </Select>
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
                <Button>Confirmar</Button>
              </Popconfirm>
            </FormItem>
          </Form>
          <div>
            <Col pull="24" style={{ paddingTop: "150px" }}>
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
                  title="Selecionar Data Hora"
                  icon={
                    this.state.statusData ? (
                      <Icon type="hourglass" />
                    ) : (
                        <Icon type="loading" />
                      )
                  }
                />
                <Step
                  title="Confimar"
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
