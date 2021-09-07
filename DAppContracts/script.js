const Bookmaker = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");

async function main() {
  let accounts = await web3.eth.getAccounts();
  let instance = await Bookmaker.deployed();
  let instanceBLBet = await BlokLanacBet.deployed();
  let owner = await instanceBLBet.owner();
  await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
  await instance.fulfill(web3.utils.asciiToHex("s-120-114-9453"));
  await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
  await instance.fulfill(web3.utils.asciiToHex("q-160-920-250-9453"));
  let amount = web3.utils.toWei("1", "ether");
  await instanceBLBet.sendTransaction({
    from: owner,
    value: amount,
  });
}

// For truffle exec
module.exports = function (callback) {
  main()
    .then(() => callback())
    .catch((err) => callback(err));
};
