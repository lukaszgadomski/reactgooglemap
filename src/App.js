import React, { Component } from "react";
import "./App.css";
import Addresses from "./components/addresses";
import AddressMap from "./components/addressmap";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Addresses />
        <AddressMap />
      </div>
    );
  }
}

export default App;
