import React, { Component } from "react";
import { Menu, Row, Icon, notification } from "antd";
import { Link } from "react-router-dom";

import "../Dashboard.css";

class MenuLateral extends Component {
  verificarPermissao = () => {
    if (this.props.role === "p") {
      notification.open({
        message: "Localizar Pacientes",
        description: "Você não tem permissão de acesso !",
        icon: <Icon type="meh-o" style={{ color: "red" }} />
      });
    }
  };

  render() {
    const opcao = this.props.aba;
    const nome = this.props.nome;
    const role = this.props.role;

    let rotaLocalizarPaciente;
    if (role === "p") {
      rotaLocalizarPaciente = (
        <Menu.Item onClick={this.verificarPermissao} disabled key="4">
          <Icon type="user" />
          <span className="nav-text">Paciente</span>
          <Link to="/paciente" />
        </Menu.Item>
      );
    } else {
      rotaLocalizarPaciente = (
        <Menu.Item onClick={this.verificarPermissao} key="4">
          <Icon type="user" />
          <span className="nav-text">Paciente</span>
          <Link to="/paciente" />
        </Menu.Item>
      );
    }

    return (
      <Menu
        className="menu_lateral"
        theme="light"
        mode="inline"
        selectedKeys={opcao}
        style={{
          height: "100%"
        }}
      >
        <div className="dashboard-lateral">
          <img
            className="imagem-dashboard"
            src="https://images.vexels.com/media/users/3/144252/isolated/preview/520774fbe1b4e03e4f7227ae5c10c399--cone-de-cor-do-estetosc-pio-by-vexels.png"
          />
          <Row className="info-person">
            <h2 className="person-nome">{nome}</h2>
            <h3 className="person-tipo">
              {role === "p" ? "Paciente" : "Médico"}
            </h3>
          </Row>
        </div>
        <Menu.Item key="1">
          <Icon type="home" theme="outlined" />
          <span className="nav-text">Home</span>
          <Link to="/home" />
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="calendar" theme="outlined" />
          <span className="nav-text">Agenda</span>
          <Link to="/agenda" />
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="reconciliation" theme="outlined" />
          <span className="nav-text">Médico</span>
          <Link to="/medico" />
        </Menu.Item>
        {rotaLocalizarPaciente}
      </Menu>
    );
  }
}

export default MenuLateral;
