import React, { Component } from "react";

import "../Dashboard.css";

import DashBoard from "./Dashboard";

class Paciente extends Component {
  render() {
    return <DashBoard abaLateral={"4"} />;
  }
}

export default Paciente;
