const ScoresAndResults = artifacts.require("ScoresAndResults");
const BlokLanacBet = artifacts.require("BlokLanacBet");

contract("ScoresAndResults", (accounts) => {
  it("score should be 1", async function () {
    let instance = await ScoresAndResults.deployed();
    await instance.setScore(web3.utils.asciiToHex("1"));
    let score = await instance.getScore();
    assert.equal(score, "1", "Score not set properly");
  });
});

contract("BlokLanacBetIntegration", (accounts) => {
  it("score should be 1 from BlokLanacBet", () =>
    ScoresAndResults.deployed()
      .then((instance) => {
        instance.setScore(web3.utils.asciiToHex("1"));
      })
      .then(() => BlokLanacBet.deployed())
      .then((instance) => instance.requestScoresAndResults())
      .then((score) => {
        assert.equal(score, "1", "Score not requested properly");
      }));
});
