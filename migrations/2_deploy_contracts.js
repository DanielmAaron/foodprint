// var product = artifacts.require("TheProduct");
const product = artifacts.require('TheProductV2');

module.exports = function (deployer) {
  deployer.deploy(product);
};
