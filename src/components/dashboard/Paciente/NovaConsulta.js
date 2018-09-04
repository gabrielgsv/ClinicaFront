import React, { Component } from "react";
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

import MenuLateral from "../MenuLateral/MenuLateral.js";
import MenuTopo from "./MenuTopo";
import axios from "axios";
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
      medico: {
        nome: "RUFINO DA SILVA SS",
        area: "OFTALMOLOGISTA",
        anos_atuacao: "20"
      },
      tokenUser: "",
      redirect: false
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
          {this.redirectLogin()}
          <Row
            type="flex"
            justify="end"
            style={{ marginTop: "-70px", paddingBottom: "20px" }}
          >
            <Search
              className="btn_custom_primary"
              style={{ marginTop: 70, marginRight: 60 }}
              placeholder="Buscar Médico"
              onSearch={value => console.log(value)}
              enterButton
            />
          </Row>
          <Card className="cards_medicos" onClick={this.onModalOpen} hoverable>
            <Meta
              className="descricoes_card_nome"
              description={this.state.medico.nome}
            />
            <Meta
              className="descricoes_card"
              description={`Área: ${this.state.medico.area}`}
            />
            <Meta
              className="descricoes_card"
              description={`Idade : ${this.state.medico.idade}`}
            />
            <Meta
              className="descricoes_card"
              description={`Anos de atuação : ${
                this.state.medico.anos_atuacao
                }`}
            />
          </Card>
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
                  <Col pull={0} sm={22} md={10} lg={9} xl={7}>
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
