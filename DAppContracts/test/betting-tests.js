const ScoresAndQuotas = artifacts.require("ScoresAndQuotas");
const BlokLanacBet = artifacts.require("BlokLanacBet");

contract("ScoresAndQuotas", (accounts) => {
  it("score should be s1-1", async function () {
    let instance = await ScoresAndQuotas.deployed();
    await instance.fulfill(web3.utils.asciiToHex("s-101-105-9460"));
    let score = await instance.gameScores(9460);
    assert.equal(score.home, "101", "Score not set properly");
    assert.equal(score.away, "105", "Score not set properly");
  });
});

contract("ScoresAndQuotas", (accounts) => {
  it("quotas should be q1.80", async function () {
    let instance = await ScoresAndQuotas.deployed();
    await instance.fulfill(web3.utils.asciiToHex("q-180-720-220-9460"));
    let quotas = await instance.gameQuotas(9460);
    assert.equal(quotas.one, "180", "Quotas not set properly");
    assert.equal(quotas.x, "720", "Quotas not set properly");
    assert.equal(quotas.two, "220", "Quotas not set properly");
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
