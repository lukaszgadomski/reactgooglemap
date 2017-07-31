//address list - container
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import { apiAddress } from "../../api";
import store from "../../store";
import Address from "./address";
import AsyncComponent from "../async";
import "./style.css";

class Addresses extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(address) {
    this.props.onSelect(address);
  }
  render() {
    const { addresses, selected, onSelect } = this.props;
    return (
      <div className="addresses">
        {addresses.map(address => (
          <Address
            key={address.id}
            address={address}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    addresses: state.addresses.list,
    selected: state.addresses.selected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelect: address => {
      dispatch(actions.clickAddress(address));
    }
  };
};

const SelectableAddressList = connect(mapStateToProps, mapDispatchToProps)(
  Addresses
);

const asyncLoader = () => {
  return apiAddress.fetch(store).then(() => {
    return SelectableAddressList;
  });
};

export default props => {
  return <AsyncComponent loader={asyncLoader} {...props} />;
};
