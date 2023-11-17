const reactComponents = require("@neutrinojs/react-components");
const devServer = require("@neutrinojs/dev-server");

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    reactComponents(),
    devServer({
      port: 8080
    }),
    (neutrino) => {
      neutrino.config.module
        .rule("font")
        .test(/\.(eot|otf|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/);
    }
  ]
};
