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
}

contract BlokLanacBet {
  address private bookmakerContract;
  mapping(address => Bet) private bets;

  constructor(address _bookmakerContract) {
    bookmakerContract = _bookmakerContract;
  }

  function makeBet(address gambler, Bet calldata bet) public{
    bets[gambler]=bet;
  }

  function processBetResult(address gambler) public view returns (uint) {
    Bet storage bet = bets[gambler];
    IBookmaker bookmaker = IBookmaker(bookmakerContract);
    bool isWinningBet=true;
    uint amount=0;
    for(uint i=0; i<bet.games.length; i++){
        uint8 gameBet = bet.bets[i];
        uint16 game = bet.games[i];
        GameScore memory gameScore = bookmaker.gameScores(game);
        if(gameBet==1){
          if(gameScore.home>gameScore.away)
            continue;
          else{
            isWinningBet=false;
            break;
          }
        }else if(gameBet==2){
          if(gameScore.home<gameScore.away)
            continue;
          else{
            isWinningBet=false;
            break;
          }
        }else{
          if(gameScore.home==gameScore.away)
            continue;
          else{
            isWinningBet=false;
            break;
          }
        }
    }
    if(isWinningBet){
      amount=calculateAmount(bet.games, bet.bets);
    }
    return amount;
  }

  function calculateAmount(uint16[] storage games, uint8[] storage bets) private view returns (uint){
    IBookmaker bookmaker = IBookmaker(bookmakerContract);
    uint result = 1;
    for(uint i=0; i<games.length; i++){
      Quotas memory quotas=bookmaker.gameQuotas(games[i]);
      uint16 quota=1;
      if(bets[i]==1){
        quota=quotas.one;
      }else if(bets[i]==2){
        quota=quotas.two;
      }else{
        quota=quotas.x;
      }
      result *= quota;
    }
    return result;
  }

}

interface IBookmaker {
  function gameScores(uint16) external view returns (GameScore memory);
  function gameQuotas(uint16) external view returns (Quotas memory);
}
