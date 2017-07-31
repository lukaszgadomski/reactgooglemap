import React from "react";
import PropTypes from "prop-types";
import Placeholder from "../placeholder";

export default class AsyncComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  componentDidMount() {
    this.props.loader().then(Component => {
      this.setState({ Component });
    });
  }

  render() {
    const { Component } = this.state;
    // eslint-disable-next-line no-unused-vars
    const {
      renderPlaceholder,
      placeholderHeight,
      loader,
      ...rest
    } = this.props;
    if (Component) {
      return <Component {...rest} />;
    }

    return renderPlaceholder
      ? renderPlaceholder()
      : <Placeholder height={placeholderHeight} />;
  }
}

AsyncComponent.propTypes = {
  loader: PropTypes.func,
  placeholderHeight: PropTypes.number,
  renderPlaceholder: PropTypes.func
};
