const Bookmaker = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");

async function main() {
  let accounts = await web3.eth.getAccounts();
  let instance = await Bookmaker.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
  await instance.fulfill(web3.utils.asciiToHex("s-120-115-9461"));
  await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
  await instance.fulfill(web3.utils.asciiToHex("q-150-920-300-9461"));
  let winningBetAmount = web3.utils.toWei("0.02", "ether");
  let winningBet = {
    games: [9460, 9461],
    bets: [2, 1],
    amount: winningBetAmount,
  };
  await instanceBLBet.makeBet(accounts[1], winningBet, {
    from: accounts[1],
    value: winningBetAmount,
  });
  let losingBetAmount = web3.utils.toWei("0.2", "ether");
  let losingBet = {
    games: [9460, 9461],
    bets: [1, 1],
    amount: losingBetAmount,
  };
  await instanceBLBet.makeBet(accounts[2], losingBet, {
    from: accounts[2],
    value: losingBetAmount,
  });
  let balanceContr = await web3.eth.getBalance(instanceBLBet.address);
  console.log(web3.utils.fromWei(balanceContr, "ether"));
  let balance = await web3.eth.getBalance(accounts[1]);
  console.log(web3.utils.fromWei(balance, "ether"));
  let res = await instanceBLBet.processBetResult.call(accounts[1]);
  let balanceContr1 = await web3.eth.getBalance(instanceBLBet.address);
  console.log(web3.utils.fromWei(balanceContr1, "ether"));
  let balance1 = await web3.eth.getBalance(accounts[1]);
  console.log(web3.utils.fromWei(balance1, "ether"));
  console.log(web3.utils.fromWei(res, "ether"));
  await instanceBLBet.withdraw.sendTransaction(accounts[4]);
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
