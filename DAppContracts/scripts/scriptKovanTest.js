const BookmakerKovan = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");

async function main() {
  let accounts = await web3.eth.getAccounts();
  let instance = await BookmakerKovan.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  let owner = await instanceBLBet.owner();
  let result = await instance.gameScores(9453);
  let resultQuotas = await instance.gameQuotas(9453);
  console.log(
    "GAME 9460 SCORE: ",
    result.home.toNumber() + " - " + result.away.toNumber()
  );
  console.log(
    "GAME 9460 QUOTAS: ",
    resultQuotas.one.toNumber() +
      " - " +
      resultQuotas.x.toNumber() +
      " - " +
      resultQuotas.two.toNumber()
  );
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
