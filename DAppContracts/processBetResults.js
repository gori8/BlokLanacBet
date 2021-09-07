const Bookmaker = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");
const { readFile } = require("fs/promises");

async function main() {
  let data = await readFile("../../results-json-server/db.json", "utf8");
  console.log(data);

  /*let accounts = await web3.eth.getAccounts();
  let instance = await Bookmaker.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
  await instance.fulfill(web3.utils.asciiToHex("s-120-114-9453"));
  await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
  await instance.fulfill(web3.utils.asciiToHex("q-160-920-250-9453"));
  let losingBetAmount = web3.utils.toWei("1", "ether");
  let losingBet = {
    games: [9460, 9453],
    bets: [1, 1],
    status: 0,
    amount: losingBetAmount,
  };
  await instanceBLBet.makeBet(accounts[2], losingBet, {
    from: accounts[2],
    value: losingBetAmount,
  });*/
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
