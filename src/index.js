import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ptBR from "antd/lib/locale-provider/pt_BR";
import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LocaleProvider } from "antd";

import RegisterClinica from "./components/autenticacao/Registro/RegisterClinica";
import LoginClinica from "./components/autenticacao/Login/LoginClinica";
import Home from "./components/dashboard/Home/Home";
import Agenda from "./components/dashboard/Agenda/Agenda";
import Medico from "./components/dashboard/Medico/Medico";
import Paciente from "./components/dashboard/Paciente/Paciente";
import AgendaPaciente from "./components/dashboard/Paciente/Agenda";
import AgendaMedico from "./components/dashboard/Medico/Agenda";
import NovaConsulta from "./components/dashboard/Paciente/NovaConsulta";
import AdicionarMedico from "./components/dashboard/Medico/AdicionarMedico";
import AdicionarPaciente from "./components/dashboard/Paciente/AdicionarPaciente";

ReactDOM.render(
  <BrowserRouter>
    <LocaleProvider locale={ptBR}>
      <Switch>
        <Route path="/" exact={true} component={App} />
        <Route path="/register" component={RegisterClinica} />
        <Route path="/login" component={LoginClinica} />
        <Route path="/home" component={Home} />
        <Route path="/agenda" component={Agenda} />
        <Route path="/novaconsulta" component={NovaConsulta} />
        <Route path="/agendapaciente" component={AgendaPaciente} />
        <Route path="/medico" component={Medico} />
        <Route path="/agendamedico" component={AgendaMedico} />
        <Route path="/paciente" component={Paciente} />
        <Route path="/adicionarmedico" component={AdicionarMedico} />
        <Route path="/adicionarpaciente" component={AdicionarPaciente} />
      </Switch>
    </LocaleProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker();
