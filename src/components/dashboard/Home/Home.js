import React, { Component } from "react";

import "../Dashboard.css";

import DashBoard from "./Dashboard";

class Home extends Component {
  render() {
    return <DashBoard abaLateral={"1"} />;
  }
}

export default Home;
