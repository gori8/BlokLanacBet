const BlokLanacBet = artifacts.require("BlokLanacBet");
const { readFile } = require("fs/promises");
const axios = require("axios").default;

async function main() {
  let instanceBLBet = await BlokLanacBet.deployed();
  let owner = await instanceBLBet.owner();
  let data = await readFile("../../results-json-server/db.json", "utf8");
  let bets = JSON.parse(data).bets;
  for (let bet of bets) {
    if (bet.status == 0 && Date.parse(bet.lastGameEndTime) < Date.now()) {
      console.log("BET: ", bet);
      await instanceBLBet.processBetResult(bet.eth_address, bet.id, {
        from: owner,
      });
      await delay(4000);
      let result = await instanceBLBet.bets(bet.eth_address);
      bet.status = result.status;
      console.log("RESULT: ", result);
      console.log("STATUS: ", result.status.toString());
      await axios.put("http://localhost:3000/bets/" + bet.id, bet);
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
