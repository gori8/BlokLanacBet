const Bookmaker = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");
const { readFile } = require("fs/promises");

async function main() {
  let accounts = await web3.eth.getAccounts();
  let instance = await Bookmaker.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  let owner = await instanceBLBet.owner();
  let data = await readFile("../../results-json-server/db.json", "utf8");
  let bets = JSON.parse(data).bets;
  console.log("BETS: ", bets);
  for (let bet of bets) {
    if (
      bet.status == 0 /*&&
      Date.parse(bet.lastGameEndTime) < Date.parse(Date.now().toString)*/
    ) {
      console.log("BET: ", bet);
      await instanceBLBet.processBetResult(bet.eth_address, bet.id, {
        from: owner,
      });
    }
  }
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
