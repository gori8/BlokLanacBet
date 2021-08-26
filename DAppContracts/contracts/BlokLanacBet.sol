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
  uint amount;
}

contract BlokLanacBet {
  address private bookmakerContract;
  mapping(address => Bet) private bets;
  address payable public owner;

  constructor(address _bookmakerContract) {
    owner = payable(msg.sender);
    bookmakerContract = _bookmakerContract;
  }

  function makeBet(address gambler, Bet calldata bet) payable external{
    require(msg.value > 0);
    bets[gambler]=bet;
  }

  

  function processBetResult(address gambler) external returns (uint) {
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
      amount=calculateAmount(bet);
      address payable _to = payable(gambler);
      (bool sent, bytes memory data) = _to.call{value: amount}("");
      require(sent, "Failed to send Ether");
      
    }
    return amount;
  }

  function calculateAmount(Bet storage bet) private view returns (uint){
    IBookmaker bookmaker = IBookmaker(bookmakerContract);
    uint16[] storage games = bet.games; 
    uint8[] storage bets = bet.bets;
    uint result = bet.amount;
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
    result=result/10**(games.length*2);
    return result;
  }

}

interface IBookmaker {
  function gameScores(uint16) external view returns (GameScore memory);
  function gameQuotas(uint16) external view returns (Quotas memory);
}
