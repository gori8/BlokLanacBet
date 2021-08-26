const Bookmaker = artifacts.require("Bookmaker");
const BlokLanacBet = artifacts.require("BlokLanacBet");

contract("Bookmaker", (accounts) => {
  it("score should be s-101-105-9460", async function () {
    let instance = await Bookmaker.deployed();
    await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
    let score = await instance.gameScores(9460);
    assert.equal(score.home, "101", "Score not set properly");
    assert.equal(score.away, "105", "Score not set properly");
  });
});

contract("Bookmaker", (accounts) => {
  it("quotas should be q-180-720-220-9460", async function () {
    let instance = await Bookmaker.deployed();
    await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
    let quotas = await instance.gameQuotas(9460);
    assert.equal(quotas.one, "180", "Quotas not set properly");
    assert.equal(quotas.x, "720", "Quotas not set properly");
    assert.equal(quotas.two, "220", "Quotas not set properly");
  });
});

contract("BlokLanacBet", (accounts) => {
  it("Bet should be winning", async function () {
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

    let balance = await web3.eth.getBalance(accounts[1]);
    let res = await instanceBLBet.processBetResult.sendTransaction(accounts[1]);
    let balance1 = await web3.eth.getBalance(accounts[1]);
    let expectedResult = (winningBetAmount * 220 * 150) / Math.pow(10, 4);
    assert.equal(
      parseFloat(web3.utils.fromWei(balance, "ether")) +
        parseFloat(web3.utils.fromWei(expectedResult.toString(), "ether")),
      parseFloat(web3.utils.fromWei(balance1, "ether")),
      "Bet process not working!"
    );
  });
});

contract("BlokLanacBet", (accounts) => {
  it("Balance on Contract should be 0.2eth", async function () {
    let instance = await Bookmaker.deployed();
    let instanceBLBet = await BlokLanacBet.deployed();
    await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
    await instance.fulfill(web3.utils.asciiToHex("s-120-115-9461"));
    await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
    await instance.fulfill(web3.utils.asciiToHex("q-150-920-300-9461"));
    let betAmount = web3.utils.toWei("0.2", "ether");
    let bet = { games: [9460, 9461], bets: [2, 1], amount: betAmount };
    await instanceBLBet.makeBet(accounts[1], bet, {
      from: accounts[0],
      value: betAmount,
    });
    let balance = await web3.eth.getBalance(instanceBLBet.address);
    assert.equal(
      web3.utils.fromWei(balance, "ether"),
      0.2,
      "Payment process not working!"
    );
  });
});

/*contract("BlokLanacBetIntegration", (accounts) => {
  it("score should be s1 from BlokLanacBet", () =>
    ScoresAndQuotas.deployed()
      .then((instance) => {
        instance.fulfill(web3.utils.asciiToHex("s1"));
      })
      .then(() => BlokLanacBet.deployed())
      .then((instance) => instance.requestScoresAndResults())
      .then((score) => {
        assert.equal(score, "s1", "Score not requested properly");
      }));
});*/
