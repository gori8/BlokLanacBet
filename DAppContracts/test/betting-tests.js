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
    let bet = { games: [9460, 9461], bets: [2, 1] };
    await instanceBLBet.makeBet(accounts[0], bet);
    let result = await instanceBLBet.processBetResult(accounts[0]);
    assert.equal(result.toNumber(), 220 * 150, "Bet process not working!");
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
