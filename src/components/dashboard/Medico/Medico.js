import React, { Component } from "react";

import "../Dashboard.css";

import DashBoard from "./Dashboard";

class Medico extends Component {
  render() {
    return <DashBoard abaLateral={"3"} />;
  }
}

export default Medico;
