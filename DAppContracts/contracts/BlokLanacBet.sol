pragma solidity ^0.8.6;

contract BlokLanacBet {
  address private scoresAndResultsContract;

  constructor(address _scoresAndResultsContract) public {
    scoresAndResultsContract = _scoresAndResultsContract;
  }

  function requestScoresAndResults() public view returns (string memory) {
    IScoresAndResults sar = IScoresAndResults(scoresAndResultsContract);
    return sar.getScore();
  }
}

interface IScoresAndResults {
  function getScore() external view returns (string memory);
}
