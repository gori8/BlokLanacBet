pragma solidity ^0.8.6;

contract ScoresAndResults {
    bytes32 public score;

    constructor() public {}

    function concatenate(string memory a, string memory b)
        private
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    function bytes32ToString(bytes32 _bytes32)
        private
        pure
        returns (string memory)
    {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function getScore() external view returns (string memory) {
        return bytes32ToString(score);
    }

    function setScore(bytes32 _score) external {
        score = _score;
    }
}
