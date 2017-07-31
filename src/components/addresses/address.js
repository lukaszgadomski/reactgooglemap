import React from "react";
import classNames from "classnames";
import "../../style.css";

export default ({ address, selected, onSelect }) => {
  var addressClass = classNames("address", {
    selected: selected && address.id === selected.id
  });
  return (
    <div className={addressClass} onClick={() => onSelect(address)}>
      <span className="icon-location" /> <span>{address.address}</span>
    </div>
  );
};
