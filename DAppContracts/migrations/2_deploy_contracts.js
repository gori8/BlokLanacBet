var ScoresAndQuotas = artifacts.require("ScoresAndQuotas");
var BlokLanacBet = artifacts.require("BlokLanacBet");

// JavaScript export
module.exports = function (deployer) {
  // Deployer is the Truffle wrapper for deploying
  // contracts to the network

  // Deploy the contract to the network
  deployer.then(async () => {
    await deployer.deploy(ScoresAndQuotas);
    await deployer.deploy(BlokLanacBet, ScoresAndQuotas.address);
  });
};
