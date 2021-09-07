pragma solidity ^0.8.6;

import "../node_modules/solidity-util/lib/Strings.sol";
import "../node_modules/solidity-util/lib/Integers.sol";
import "../node_modules/solidity-util/lib/Addresses.sol";

struct Quotas {
    uint16 one;
    uint16 two;
    uint16 x;
}
struct GameScore {
    uint8 home;
    uint8 away;
}

contract Bookmaker {
    using Strings for string;
    using Integers for uint256;
    using Addresses for address;
    using Addresses for address payable;
    mapping(uint16 => GameScore) public gameScores;
    mapping(uint16 => Quotas) public gameQuotas;

    constructor() {}

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

    function strToUint(bytes memory b) internal pure returns (uint256 result) {
        uint256 i = 0;
        uint256 tr = 0;
        result = 0;
        while (uint256(uint8(b[b.length - tr - 1])) == 0x00) {
            tr++;
        }
        for (; i < b.length - tr; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result *= 10;
                result = result + uint256(c - 48);
            }
        }
        return result;
    }

    function fulfill(bytes32 _data) external {
        string memory dataStr = bytes32ToString(_data);
        string[] memory split = dataStr.split("-");
        if (
            keccak256(abi.encodePacked(_data[0])) ==
            keccak256(abi.encodePacked("s"))
        ) {
            GameScore storage gameScore = gameScores[
                uint16(strToUint(bytes(split[3])))
            ];
            gameScore.home = uint8(strToUint(bytes(split[1])));
            gameScore.away = uint8(strToUint(bytes(split[2])));
        } else {
            Quotas storage quotas = gameQuotas[
                uint16(strToUint(bytes(split[4])))
            ];
            quotas.one = uint16(strToUint(bytes(split[1])));
            quotas.two = uint16(strToUint(bytes(split[3])));
            quotas.x = uint16(strToUint(bytes(split[2])));
        }
    }
}
