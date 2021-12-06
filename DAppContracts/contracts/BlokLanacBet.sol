//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

struct Quotas {
    uint16 one;
    uint16 two;
    uint16 x;
}
struct GameScore {
    uint8 home;
    uint8 away;
}
struct Bet {
    uint16[] games;
    uint8[] bets;
    uint8 status;
    uint256 amount;
}

contract BlokLanacBet {
    address public bookmakerContract;
    mapping(address => Bet) public bets;
    address payable public owner;
    event UserWonBetEvent(
        address gambler,
        uint256 _amount,
        uint256 indexed externalBetId
    );

    constructor(address _bookmakerContract) {
        owner = payable(msg.sender);
        bookmakerContract = _bookmakerContract;
    }

    function placeBet(address gambler, Bet calldata bet) external payable {
        require(msg.value > 0 && msg.value == bet.amount && bet.status == 0 , "Transaction data not valid.");
        bets[gambler] = bet;
        bets[gambler].amount = calculateAmount(bets[gambler]);
    }

    function processBetResult(address gambler, uint256 externalBetId)
        external
        returns (uint8)
    {
        Bet storage bet = bets[gambler];
        if (bet.status == 0) {
            IBookmaker bookmaker = IBookmaker(bookmakerContract);
            bool isWinningBet = true;
            for (uint256 i = 0; i < bet.games.length; i++) {
                uint8 gameBet = bet.bets[i];
                uint16 game = bet.games[i];
                GameScore memory gameScore = bookmaker.gameScores(game);
                if (gameBet == 1) {
                    if (gameScore.home > gameScore.away) continue;
                    else {
                        isWinningBet = false;
                        break;
                    }
                } else if (gameBet == 2) {
                    if (gameScore.home < gameScore.away) continue;
                    else {
                        isWinningBet = false;
                        break;
                    }
                } else {
                    if (gameScore.home == gameScore.away) continue;
                    else {
                        isWinningBet = false;
                        break;
                    }
                }
            }
            bet.status = 1;
            if (isWinningBet) {
                address payable _to = payable(gambler);
                (bool sent, bytes memory data) = _to.call{value: bet.amount}("");
                require(sent, "Failed to send Ether!");
                bet.status = 2;
                emit UserWonBetEvent(gambler, bet.amount, externalBetId);
            }
        }
        return bet.status;
    }

    function calculateAmount(Bet storage bet) private view returns (uint256) {
        IBookmaker bookmaker = IBookmaker(bookmakerContract);
        uint16[] memory games = bet.games;
        uint8[] memory userBets = bet.bets;
        uint256 result = bet.amount;
        for (uint256 i = 0; i < games.length; i++) {
            Quotas memory quotas = bookmaker.gameQuotas(games[i]);
            uint16 quota = 1;
            if (userBets[i] == 1) {
                quota = quotas.one;
            } else if (userBets[i] == 2) {
                quota = quotas.two;
            } else {
                quota = quotas.x;
            }
            result *= quota;
        }
        result = result / 10**(games.length * 2);
        return result;
    }

    function withdraw(uint amount) external {
        require(amount <= address(this).balance && msg.sender == owner);
        (bool sent, bytes memory data) = owner.call{value: amount}("");
        require(sent, "Failed to withdraw Ether!");
    }

    receive() external payable {
        require(msg.sender==owner, 'Error. Only contract owner can send this transaction.');
    }
}

interface IBookmaker {
    function gameScores(uint16) external view returns (GameScore memory);

    function gameQuotas(uint16) external view returns (Quotas memory);
}
