import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Icon,
  DatePicker,
  notification
} from "antd";
import { Link } from "react-router-dom";

import axios from "axios";
import LogoPaciente from "../../../assets/paciente-logo.jpg";
import "../Auth.css";
import { API_ROOT } from "../../../api-config"


const FormItem = Form.Item;
const Option = Select.Option;

class RegisterClinica extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      loading: false,
      nomebutton: "Registrar",
      nome: "",
      email: "",
      password: "",
      data_nascimento: "",
      hospital: "",
      carteira: "",
      novo_paciente: ""
    };
  }

  // Registrar paciente
  RegistrarPaciente = e => {
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

        axios.post(`${API_ROOT}/api/paciente`, dadosPaciente).then(response => {
          if (response.status === 201) {
            this.setState({
              novo_paciente: response.data.nome,
              nomebutton: "Registrando..."
            });
            this.setState({
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

  // Caso consiga registrar novo paciente
  mensagemSucesso() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      notification.open({
        message: `${this.state.novo_paciente}`,
        description: "Você foi cadastrado com sucesso :)",
        icon: <Icon type="check" style={{ color: "green" }} />
      });
      this.setState({ nomebutton: "Registrar" });
    }, 2000);
  }

  onDataNascimento = (date, dateString) => {
    this.setState({
      data_nascimento: dateString
    });
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

  // Mudança de estados
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Mudança de hospital.
  escolherHospital = value => {
    this.setState({
      hospital: value
    });
  };

  render() {
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
      <fragments>
        <div className="wallpaper" />
        <div className="telaRegistro">
          <Row>
            <img className="imagemTelaInicio" src={LogoPaciente} />
            <Col span={24} pull={7} className="boxRegistro">
              <div className="login">
                <h2 className="headerLogin">
                  JUNTE-SE PARA A NOSSA CLÍNICA :)
                </h2>
                <Form onSubmit={this.RegistrarPaciente}>
                  <FormItem {...formItemLayout} label="Nome">
                    {getFieldDecorator("nome", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor digite seu nome"
                        }
                      ]
                    })(
                      <Input name="nome" onChange={this.onChange.bind(this)} />
                    )}
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
                          message: "Por favor digite seu email"
                        }
                      ]
                    })(<Input name="email" onChange={this.onChange} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Senha">
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Por favor digite sua senha"
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
                          message: "Por favor confirme sua senha"
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} />
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
                  </FormItem>
                  Se ja tem uma conta <Link to="/login"> clique aqui !</Link>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </fragments>
    );
  }
}

export default Form.create()(RegisterClinica);
