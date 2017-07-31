//address list - container
import React, { Component } from "react";
import { connect } from "react-redux";
import GoogleMap from "../googlemap";
import * as actions from "./actions";

class MapAddress extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(address) {
    this.props.onSelect(address);
  }
  render() {
    const { map, onMarkerClick } = this.props;
    return <GoogleMap map={map} onMarkerClick={onMarkerClick} />;
  }
}

const mapStateToProps = state => {
  return {
    map: state.map
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMarkerClick: address => {
      dispatch(actions.clickAddress(address));
    }
  };
};

const ReduxAddressMap = connect(mapStateToProps, mapDispatchToProps)(
  MapAddress
);

export default ReduxAddressMap;
