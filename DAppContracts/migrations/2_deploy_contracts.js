var BookmakerDevelopment = artifacts.require("BookmakerDevelopment");
var Bookmaker = artifacts.require("Bookmaker");
var BlokLanacBet = artifacts.require("BlokLanacBet");

// JavaScript export
module.exports = function (deployer, network) {
  // Deployer is the Truffle wrapper for deploying
  // contracts to the network

  // Deploy the contract to the network
  deployer.then(async () => {
    if (network == "development") {
      await deployer.deploy(BookmakerDevelopment);
      await deployer.deploy(BlokLanacBet, BookmakerDevelopment.address);
    } else if (network == "kovan") {
      await deployer.deploy(Bookmaker);
      await deployer.deploy(BlokLanacBet, Bookmaker.address);
    }
  });
};
