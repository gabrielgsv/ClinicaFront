import "babel-polyfill";
import { LocaleProvider } from "antd";
import ptBR from "antd/lib/locale-provider/pt_BR";

import LoginClinica from "./components/autenticacao/Login/LoginClinica";
// import RegisterClinica from "./components/autenticacao/RegisterClinica";
// import SiderHome from "./components/SiderHome";

//CSS
import "antd/dist/antd.css";
import "./App.css";

// Imports
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={ptBR}>
        <div className="App">
          <LoginClinica />
        </div>
      </LocaleProvider>
    );
  }
}

export default App;
