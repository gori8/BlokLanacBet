import { Injectable } from '@angular/core';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { Subject } from 'rxjs';
import { BetsService } from '../bets/bets.service';
import { ScoresService } from '../scores/scores.service';
import { ConfigService } from '../config/config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
const BlokLanacBetAbi = require('../../../../../../DAppContracts/build/contracts/BlokLanacBet.json');

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  private web3js: any;
  private provider: any;
  private accounts: any;
  web3Modal;
  private blokLanacBetContract;
  private activeBet;
  private activeBetsEventSubsriber = null;

  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();
  private accountBalanceSource = new Subject<any>();
  accountBalance$ = this.accountBalanceSource.asObservable();
  currentAccount;

  constructor(
    private betsService: BetsService,
    private scoresService: ScoresService,
    private configService: ConfigService,
    private snackBar: MatSnackBar
  ) {
    console.log('Network is : ' + configService.config.network);
    const providerOptions = {
      /*walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: '27e484dcd9e3efcfd25a83a78777cdf1', // required
        },
      },*/
    };

    this.web3Modal = new Web3Modal({
      network: configService.config.network, // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: 'rgb(39, 49, 56)',
        main: 'rgb(199, 199, 199)',
        secondary: 'rgb(136, 136, 136)',
        border: 'rgba(195, 195, 195, 0.14)',
        hover: 'rgb(16, 26, 32)',
      },
    });
  }

  async connectAccount() {
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts);
    let balanceInWei = await this.web3js.eth.getBalance(this.accounts[0]);
    let balance = await Web3.utils.fromWei(balanceInWei, 'ether');
    console.log('BALANCE: ', balance);
    this.accountBalanceSource.next(balance);
    this.currentAccount = this.accounts[0];

    this.blokLanacBetContract = new this.web3js.eth.Contract(
      BlokLanacBetAbi.abi,
      BlokLanacBetAbi.networks[this.configService.config.network_id].address
    );

    /*let bets = await this.betsService
      .getAllUserBets(this.accounts[0])
      .toPromise();
    console.log(this.accounts[0]);
    console.log('BETS:', bets);
    if (bets.length > 0) {
      this.activeBet = await bets.reduce(function (prev, curr) {
        return prev.id > curr.id ? prev : curr;
      });
    } else {
      this.activeBet = { id: 500000 };
    }

    this.setUpEventSubscriber();*/
  }

  async makeBet(bets: any, amount: number) {
    let contractBetAmount = Web3.utils.toWei(amount.toString(), 'ether');
    let contractGames: any[] = [];
    let contractBets: any[] = [];
    bets.forEach((bet: any) => {
      contractGames.push(bet.gameId);
      contractBets.push(bet.betOn);
    });
    let contractBet = {
      games: contractGames,
      bets: contractBets,
      status: 0,
      amount: contractBetAmount,
    };
    return await this.blokLanacBetContract.methods
      .makeBet(this.accounts[0], contractBet)
      .send({
        from: this.accounts[0],
        value: contractBetAmount,
      })
      .then((tx) => {
        return this.scoresService.getGames(contractGames).toPromise();
      })
      .then((games) => {
        let filteredGames = games.filter((game: { gameId: any }) => {
          let flag = bets.find((b: any) => b.gameId == game.gameId);
          if (flag) return true;
          else return false;
        });
        console.log('GAMES:', games);
        console.log('FILTERED GAMES:', filteredGames);
        console.log('DATE:', new Date(filteredGames[0].endTimeUTC));
        console.log('USER ADDRESS:', this.accounts[0]);
        let dateOfLastGame = new Date(
          Math.max(...filteredGames.map((e: any) => new Date(e.endTimeUTC)))
        );
        let newBet = {
          eth_address: this.accounts[0],
          bet: bets,
          status: 0,
          lastGameEndTime: dateOfLastGame,
        };
        return this.betsService.addBet(newBet).toPromise();
      })
      .then((newBet) => {
        this.activeBet = newBet;
        this.setUpEventSubscriber();
        return newBet;
      });
  }

  async processBetResult() {
    let ret = await this.blokLanacBetContract.methods
      .processBetResult(this.accounts[0], this.activeBet.id)
      .send({ from: this.accounts[0] });

    return ret;
  }

  setUpEventSubscriber() {
    if (this.activeBetsEventSubsriber != null) {
      this.activeBetsEventSubsriber.unsubscribe();
    }

    let options = {
      filter: {
        externalBetId: this.activeBet.id,
      },
      fromBlock: 0,
    };

    this.activeBetsEventSubsriber =
      this.blokLanacBetContract.events.DepositWinningBet(options);
    this.activeBetsEventSubsriber
      .on('data', (event: any) => {
        console.log('DATA:', event);
        this.snackBar.open("You've just won your bet. Congrats!", null, {
          duration: 3000,
        });
        this.connectAccount();
        /*this.scoreService.getBetById(this.activeBet.id).subscribe(
          (res) => {
            res.status = 2;
            this.scoreService.changeBetStatus(res).subscribe(
              (res) => {},
              (err) => {}
            );
          },
          (err) => {}
        );*/
      })
      .on('changed', (changed: any) => console.log('CHANGED:', changed))
      .on('error', (err: any) => {
        throw err;
      })
      .on('connected', (str: any) => console.log(str));
  }
}
