const BookmakerKovan = artifacts.require("BookmakerKovan");
const BlokLanacBet = artifacts.require("BlokLanacBet");
const { readFile } = require("fs/promises");

async function main() {
  let accounts = await web3.eth.getAccounts();
  let instance = await BookmakerKovan.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  let owner = await instanceBLBet.owner();
  await instance.requestQuotas("9460");
  /*await instance.requestQuotas("9451");
  await instance.requestQuotas("9452");
  await instance.requestQuotas("9453");
  await instance.requestQuotas("9428");
  await instance.requestQuotas("9438");
  await instance.requestQuotas("9460");
  await instance.requestScore("9450");
  await instance.requestScore("9451");
  await instance.requestScore("9452");
  await instance.requestScore("9453");
  await instance.requestScore("9428");
  await instance.requestScore("9438");
  await instance.requestScore("9460");

  let data = await readFile("../../results-json-server/db.json", "utf8");
  let games = JSON.parse(data).games;

  for (let game of games) {
    await instance.simpleFulfill(web3.utils.asciiToHex(game.oracle_score));
    await instance.simpleFulfill(web3.utils.asciiToHex(game.oracle_quotas));
  }

  let amount = web3.utils.toWei("0.02", "ether");
  await instanceBLBet.sendTransaction({
    from: owner,
    value: amount,
  });*/
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
