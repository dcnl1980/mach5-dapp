<template>
    <div>
        <web3-modal-component
        ref="web3modal"
        :theme="theme"
        :provider-options="providerOptions"
        cache-provider
    />

        <!-- Alert -->
        <transition name="fade">
        <div
            class="z-50 fixed inset-x-0 top-0 m-auto flex items-center bg-black text-white text-md px-4 py-4 lg:w-6/6 "
            role="alert" v-if="alertShow">
          <p>{{ alertMsg }}</p>
        </div>
        </transition>

        <section class="p-6 mx-auto">

        <div v-if="state">
            <h3>Address: {{state.address}}</h3>
            <h3>ChainId: {{state.chainId}}</h3>
        </div>
        
        <!-- Button to connect Web3 -->
    <a v-if="ethereum==null" href="http://www.metamask.io" target="_blank"
           class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-900 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-200">
          <img class="-ml-0.5 mr-2 h-4 w-4" src="../assets/img/providers/metamask.svg">
          <span class="lg:block">Install MetaMask</span>
        </a>
        <button v-else-if="!account" type="button" @click="connect"
                class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-900 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-200">
          <img class="-ml-0.5 mr-2 h-4 w-4" src="../assets/img/providers/metamask.svg">
          <span class="lg:block">Connect Wallet</span>
        </button>
        <button v-else type="button" @click="connectMetaMask(2)"
                class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-900 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-200">
          <img class="-ml-0.5 mr-2 h-4 w-4" src="../assets/img/providers/metamask.svg">
          <span
              class="lg:block">{{ this.account.substring(0, 6) + "..." + this.account.substring(this.account.length - 4, this.account.length) }}</span>
        </button>
      

    <div class='metamask-info'>
     
      <p>Network: {{ this.networkId }}</p>
      <p>Account: {{ this.account }}</p>
      <p>Balance: {{ this.balance }}</p>

    </div>

    <button type="button"
                class="inline-flex items-center px-3 py-2 border border-gray-400 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style="height:38px"
                @click="claimToken"
        >
          <span class="lg:block">{{ parseInt(this.claimableAmount) }} CJ</span>
    </button>

    </section>

    </div>
  </template>
  <script>
  import Web3 from 'web3'
  import PresaleJson from "../../contracts/Presale.json"
  import TokenJson from "../../contracts/Token.json"

  import { Web3ModalComponent } from "web3modal-vue3"
  import WalletConnectProvider from "@walletconnect/web3-provider";
  import { web3Modal } from "../config/mixins";
  import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk"

  export default {
    name: 'TokenSale',
    components: {
      Web3ModalComponent
    },
    mixins: [web3Modal],
    computed: {
        web3() {
      return this.$store.state.web3
    },
    chainId() {
      if (this.$store.state.web3.isInjected == false) {
        return 1
      } else {
        return this.$store.state.myChainId
      }
    },
    recvAmount: {
      get() {
        return (this.sendAmount * this.price).toFixed(0);
      },
      set(newVal) {
        this.sendAmount = (newVal / this.price).toFixed(0);
      }
    }
    },

    data() {
    return {
      web3Obj: new Web3(Web3.givenProvider || 'wss://mainnet.infura.io/ws/v3/6c3b2a6b260041f2804c140af1714a46'),
      contractObj: {},
      tokenContractObj: {},
      price: 0,
      sendAmount: 0,
      ethereum: window.ethereum,
      copiedTooltip: false,
      contractAddr: "",
      nextContractAddr: "",
      abi: PresaleJson.abi,
      tokenAbi: TokenJson.abi,
      alertShow: false,
      alertMsg: "",
      networkId: "1",
      account: "",
      is_tokensale: false,
      is_paused: false,
      nextBalance: 0,
      nextBurned: 0,
      inCirculation: 0,
      claimableAmount: 0,
      curCoin: { sym: "ETH", icon: "../assets/img/icons/icon.png" },
      dropdownShow: false,
      soldPercent: 0,
      soldAmount: 0,
      totalPool: 0,
      priceUsd: 0,
      minBUY: 0.01,
      theme: 'light',
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "_"
          }
        },
        coinbasewallet: {
            package: CoinbaseWalletSDK,
            options: {
                infuraId: "_"
            }
        }
      },
      number: 0,
      balance: 0
    }
  },

  created() {
    if (window.ethereum) {
      console.log("created---------", window.ethereum)
      this.web3Obj.eth.getAccounts().then((result) => {
        this.account = result[0];
        //this.$store.dispatch("checkMetamaskAddr", {metamask:result[0]});
      })
      window.ethereum.on('networkChanged', (networkId) => {
        this.networkChanged(networkId);
      });
      window.ethereum.on('accountsChanged', async (accounts) => {
        this.account = accounts[0];
        this.getBalance();
        this.calcPrice();
      });
    }
    this.web3Obj.eth.net.getId().then((result) => {
      this.networkChanged(result)
    });
    // WalletConnect
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }
  },
  mounted() {
    // WalletConnect
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal;
      //this.$store.dispatch("setWeb3ModalAction", web3modal)
      this.$store.commit('setWeb3Modal', web3modal)
      console.log("cacheProvider=>>>>", web3modal.cacheProvider);
      if (web3modal.cacheProvider) {
        this.connect()
      }
    })
  },
  methods: {
    // WalletConnect
    connect() {
        this.$store.dispatch("connect")
        //this.subscribeMewBlockHeaders()
    },
    async switchNetwork(netid) {
      this.dropdownShow = false;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: netid}],
      });
    },
    networkChanged(networkId) {
      this.dropdownShow = false;
      this.networkId = networkId;

      if (networkId == 5) {
        // Kovan TestNET
        this.web3Obj = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/6c3b2a6b260041f2804c140af1714a46');
        this.contractAddr = "0xD006D7AB8eC86C1814365F567609c4EB4fc75497";
        this.tokenContractAddr = "0x7d2220fa4b36cfb02d5092c5a165356d2d585d87";
        this.curCoin = {sym: "ETH", icon: "../assets/img/icons/icon.png"};
        this.totalPool = '10000000000';
        this.minBUY = '0.01';
      } else {
        // Fallback to MAINNET
        this.web3Obj = new Web3(Web3.givenProvider || 'wss://mainnet.infura.io/ws/v3/6c3b2a6b260041f2804c140af1714a46');
        this.contractAddr = "0xD006D7AB8eC86C1814365F567609c4EB4fc75497"; // Presale address
        this.tokenContractAddr = "0x7d2220fa4b36cfb02d5092c5a165356d2d585d87"; // Token address
        this.curCoin = {sym: "ETH", icon: "../assets/img/icons/icon.png"};
        this.totalPool = '10000000000';
        this.minBUY = '0.01';
      }
      this.tokenContractObj = new this.web3Obj.eth.Contract(this.tokenAbi, this.tokenContractAddr);
      this.getBalance();
      this.contractObj = new this.web3Obj.eth.Contract(this.abi, this.contractAddr);
      this.calcPrice();
      //this.getSupply();
      //this.getPrice();
    },

    async getBalance() {
      await this.web3Obj.eth.getBalance(this.account).then((result) => {
        this.balance = Web3.utils.fromWei(result, 'ether');
      });
      this.tokenContractObj.methods.balanceOf(this.account).call().then((result) => {
        this.nextBalance = result;
      });
    },

    async getSupply() {
      await this.ContractObj.methods.totalSupply().call().then((result) => {
          this.inCirculation = (result / 1e18).toFixed(0);
      })
    },

    async getPrice() {
      console.log('----- INIT')
      const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0x5d10780da28e5b225a0c6a1bed230a04cf96ece3')
      const result = await response.json();
      this.priceUsd = result.data.price;
    },

    showAlert: function (msg) {
      this.alertShow = true;
      this.alertMsg = msg;
      setTimeout(() => {
        this.alertMsg = "";
        this.alertShow = false;
      }, 3000)
    },
    calcPrice: async function () {
      await this.contractObj.methods.price().call().then((res) => {
        this.price = 1 / (res / 1e18);
      })
      await this.contractObj.methods.paused().call().then((res) => {
        this.is_paused = res;
      })
      await this.contractObj.methods.claimable(this.account).call().then((res) => {
        this.claimableAmount = res / 1e18;
      })
      await this.contractObj.methods.weiRaised().call().then((res) => {
        this.soldAmount = res * this.price / 1e18;
        this.soldPercent = 100 / (this.totalPool / this.soldAmount);
      })
    },
    claimToken: async function () {
      if (this.claimableAmount == 0) {
        this.showAlert("You don't have any tokens to claim, you need to BUY first.");
        return;
      }
      // Check if PRESALE has been ended
      await this.contractObj.methods.ends().call().then(async (res) => {
        if (Math.round(new Date().getTime() / 1000) < res) {
          this.showAlert("Presale has not been ended. Tokens can be claimed after the tokensale is finished.");
        } else {
          await this.contractObj.methods.claim().send({from: this.account, gas: 300000, type: "0x2"}).then((res) => {
            console.log(res);
            document.location.reload();
          })
        }
      })
    },
    buyToken: async function () {
      if (this.sendAmount < this.minBUY) {
        return;
      }
      if (this.sendAmount > this.balance) {
        this.showAlert("Insufficient funds");
        return;
      }
      await this.contractObj.methods.buy().send({
        from: this.account,
        gas: 300000,
        value: Web3.utils.toWei(this.sendAmount, "ether")
      }).then((res) => {
        console.log(res);
        document.location.reload();
      })
    },
    copyAddress: function () {
      var copyText = document.getElementById("address");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.getSelection().removeAllRanges();
      this.copiedTooltip = true;
      setTimeout(() => {
        this.copiedTooltip = false;
      }, 1000);
    },

    // Fallback Function
    connectMetaMask: async function (param) {
      if (param == 1) {
        await window.ethereum.request({method: 'eth_requestAccounts'}).then((result) => {
          console.log("result=" + result)
          document.location.reload();
        });
      } else {
        console.log("here",this.$store.state.web3.coinbase)
        let params = [
          {
            from: this.$store.state.web3.coinbase,
            to: '0x22fd1B466F8883DA9376dEaC59bD8Ab299785BA7',
          },
        ];
        await window.ethereum
            .request({
              method: 'eth_sendTransaction',
              params,
            })
            .then((result) => {
              console.log(result)
            })
            .catch((error) => {
              console.log(error)
            });
      }
    }
  }


  }

  
  </script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button[disabled="disabled"] {
  cursor: not-allowed;
  opacity: 0.8;
}
</style>
