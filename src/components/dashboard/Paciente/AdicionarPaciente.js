import React, { Component } from "react";
import { Redirect } from "react-router";
import {
  Layout,
  Col,
  Row,
  Form,
  Input,
  Select,
  Button,
  Icon,
  DatePicker,
  notification
} from "antd";

import MenuLateral from "../MenuLateral/MenuLateral";
import MenuTopo from "./MenuTopo";
import axios from "axios";

import "../Dashboard.css";

const { Content, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class AdicionarPaciente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dadosUsuario: {
        codigo: "",
        nome: "",
        role: ""
      },
      nomebutton: "Registrar",
      nome: "",
      email: "",
      password: "",
      hospital: "",
      data_nascimento: "",
      carteira: "",
      novo_paciente: "",
      previewVisible: false,
      previewImage: "",
      confirmDirty: false,
      autoCompleteResult: [],
      fileList: 0,
      tokenUser: "",
      redirect: false,
      loading: false
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  escolherHospital = value => {
    this.setState({
      hospital: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const dadosPaciente = {
          nome: this.state.nome,
          email: this.state.email,
          senha: this.state.password,
          data_nascimento: this.state.data_nascimento,
          hospital: this.state.hospital,
          carteira: this.state.carteira
        };

        axios.post(`/api/paciente`, dadosPaciente).then(response => {
          if (response.status == 201) {
            this.setState({
              novo_paciente: response.data.nome,
              nomebutton: "Registrando...",
              nome: "",
              password: "",
              email: "",
              hospital: "",
              carteira: ""
            });
            this.mensagemSucesso();
          }
        });
      }
    });
  };

  onDataNascimento = (date, dateString) => {
    this.setState({
      data_nascimento: dateString
    });
  };

  mensagemSucesso() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      notification.open({
        message: `${this.state.novo_paciente}`,
        description: "Foi cadastrado com sucesso :)",
        icon: <Icon type="check" style={{ color: "green" }} />
      });
      this.setState({ nomebutton: "Registrar" });
    }, 2000);
  }

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

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("As senhas devem ser iguais!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net"].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const abaSelecionada = this.props.abaLateral;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        lg: { span: 5 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        lg: { span: 18 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        lg: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

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
            justify="center"
          >
            <Col span={10}>
              <div className="descricao-pagina">Adicionar Paciente</div>
            </Col>
          </Row>
          <Content className="conteudo_principal">
            <Row type="flex" justify="center" style={{ marginTop: 100 }}>
              <Col span={9}>
                <Form onSubmit={this.handleSubmit}>
                  <div className="clearfix" />
                  <FormItem {...formItemLayout} label="Nome">
                    {getFieldDecorator("name", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor digite o nome"
                        }
                      ]
                    })(<Input name="nome" onChange={this.onChange} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="E-mail">
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          type: "email",
                          message: "O email deve ser valido"
                        },
                        {
                          required: true,
                          message: "Por favor digite o email"
                        }
                      ]
                    })(<Input name="email" onChange={this.onChange} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Senha">
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor digite a senha"
                        },
                        {
                          validator: this.validateToNextPassword
                        }
                      ]
                    })(
                      <Input
                        name="password"
                        type="password"
                        onChange={this.onChange}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Confirmar">
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor confirme a senha"
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(
                      <Input
                        name="password"
                        type="password"
                        onBlur={this.handleConfirmBlur}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    style={{ textAlign: "left" }}
                    {...formItemLayout}
                    label="Nascimento"
                  >
                    {getFieldDecorator("data_nascimento", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor confirme sua data de nascimento"
                        }
                      ]
                    })(
                      <DatePicker
                        style={{ textAlign: "left" }}
                        name="data_nascimento"
                        onChange={this.onDataNascimento}
                      />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Hospital" hasFeedback>
                    {getFieldDecorator("hospital", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor escolha o Hospital"
                        }
                      ]
                    })(
                      <Select
                        onChange={this.escolherHospital}
                        placeholder="Por favor escolha um Hospital"
                      >
                        <Option value="unimed">Unimed</Option>
                        <Option value="regional">Regional</Option>
                        <Option value="hospitaldocoracao">
                          Hospital Do Coração
                        </Option>
                        <Option value="hospitaldocancer">
                          Hospital Do Cancer
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Carteira">
                    {getFieldDecorator("number", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor digite sua carteirinha"
                        }
                      ]
                    })(<Input name="carteira" onChange={this.onChange} />)}
                  </FormItem>
                  <FormItem
                    className={"form-button-custom"}
                    {...tailFormItemLayout}
                  >
                    <Row type="flex" justify="center">
                      <Button
                        className="login-form-button btn-registro-custom"
                        size="large"
                        type="primary"
                        loading={this.state.loading}
                        htmlType="submit"
                      >
                        {this.state.nomebutton}
                        <Icon style={{ marginLeft: 11 }} type="plus" />
                      </Button>
                    </Row>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Form.create()(AdicionarPaciente);
