pragma solidity ^0.8.6;

import "../node_modules/solidity-util/lib/Strings.sol";
import "../node_modules/solidity-util/lib/Integers.sol";
import "../node_modules/solidity-util/lib/Addresses.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

struct Quotas {
    uint16 one;
    uint16 two;
    uint16 x;
}
struct GameScore {
    uint8 home;
    uint8 away;
}

contract BookmakerKovan is ChainlinkClient {
    using Strings for string;
    using Integers for uint256;
    using Addresses for address;
    using Addresses for address payable;
    using Chainlink for Chainlink.Request;
    mapping(uint16 => GameScore) public gameScores;
    mapping(uint16 => Quotas) public gameQuotas;
    event ChainlinkAnswered(string ret);

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor() {
        setPublicChainlinkToken();
        //Alphachain.io oracle node
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "b7285d4859da4b289c7861db971baf0a";
        fee = 0.1 * 10**18; // (Varies by network and job)
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

    function concatenate(string memory a, string memory b)
        private
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    function requestScore(string calldata gameId)
        external
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        request.add(
            "get",
            "https://my-json-server.typicode.com/gori8/nba-results-api/games"
        );
        string memory gameIdParamStr = "gameId=";
        request.add("queryParams", concatenate(gameIdParamStr, gameId));

        request.add("path", "0.oracle_score");

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function requestQuotas(string calldata gameId)
        external
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        request.add(
            "get",
            "https://my-json-server.typicode.com/gori8/nba-results-api/games"
        );
        string memory gameIdParamStr = "gameId=";
        request.add("queryParams", concatenate(gameIdParamStr, gameId));

        request.add("path", "0.oracle_quotas");

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, bytes32 _data)
        external
        recordChainlinkFulfillment(_requestId)
    {
        string memory dataStr = bytes32ToString(_data);
        emit ChainlinkAnswered(dataStr);
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

    function simpleFulfill(bytes32 _data)
        external
    {
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
