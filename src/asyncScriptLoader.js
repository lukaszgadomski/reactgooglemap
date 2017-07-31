/* eslint-env es6 */

import Promise from "bluebird";

export default src => {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = resolve;
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
  });
};
