import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { Row, Col, Form, Icon, Input, Button, notification } from "antd";

import "../Auth.css";
import "antd/dist/antd.css";
import axios from "axios";

const FormItem = Form.Item;

class LoginClinica extends Component {
  state = {
    email: "",
    senha: "",
    btnStatus: true,
    nomebutton: "Acessar",
    redirect: false,
    loading: false
  };

  // Redireciona para a página principal
  redirectHome = () => {
    if (this.state.redirect) {
      return <Redirect to="/home" />;
    }
  };

  // Logar usuário.
  logarUsuario = e => {
    e.preventDefault();
    const dadosUsuario = {
      email: this.state.email,
      senha: this.state.senha
    };
    this.setState({ nomebutton: "Validando" });
    axios
      .post(`https://clini-api-staging.herokuapp.com/api/login`, dadosUsuario)
      .then(response => {
        if (response.status === 200) {
          this.setState({ loading: true });
          setTimeout(() => {
            this.setState({ redirect: true });
          }, 2000);
        }
      })
      .catch(() => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, nomebutton: "Acessar" });
          this.mensagemErro();
        }, 2000);
      });
  };

  // Caso as credenciais estejam errada.
  mensagemErro() {
    notification.open({
      message: "Falha ao acessar painel",
      description: "E-mail ou senha incorretos :(",
      icon: <Icon type="close" style={{ color: "red" }} />
    });
    this.setState({
      email: "",
      senha: "",
      btnStatus: true
    });
  }

  // Mudança de estados
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    // Verifica se email e senha são vazios
    if (this.state.email !== "" && this.state.senha !== "") {
      this.setState({
        btnStatus: false
      });
    }
  };

  render() {
    return (
      <fragments>
        <div className="wallpaper" />
        <div className="telaLogin">
          {this.redirectHome()}
          <Row>
            <img
              className="imagemTelaInicio"
              src="https://images.vexels.com/media/users/3/144252/isolated/preview/520774fbe1b4e03e4f7227ae5c10c399--cone-de-cor-do-estetosc-pio-by-vexels.png"
            />
            <Col span={24} pull={6} className="boxLogin">
              <div className="login">
                <h1 className="headerLogin">Acessar Sua Conta</h1>
                <Form className="login-form">
                  <FormItem>
                    <Input
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange.bind(this)}
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Email"
                    />
                  </FormItem>
                  <FormItem>
                    <Input
                      name="senha"
                      value={this.state.senha}
                      onChange={this.handleChange.bind(this)}
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Senha"
                      type="password"
                    />
                  </FormItem>
                  <FormItem>
                    <Button
                      disabled={this.state.btnStatus}
                      size="large"
                      type="primary"
                      className="btn-custom"
                      loading={this.state.loading}
                      onClick={this.logarUsuario}
                    >
                      {this.state.nomebutton}
                      <Icon style={{ marginLeft: 15 }} type="right" />
                    </Button>
                    <br />
                    Ou <Link to="/register">registrar agora !</Link>
                  </FormItem>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </fragments>
    );
  }
}

export default LoginClinica;
