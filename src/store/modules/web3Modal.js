import { getLibrary } from "@/utils/web3"
import { ethers } from "ethers"
import { parseInt } from "lodash"

const web3ModalStore = {
  state: {
    web3Modal: null,

    library: getLibrary(),
    active: false,
    account: null,
    balance: 0,
    chainId: 0
  },
  mutations: {
    setWeb3Modal(state, web3Modal) {
      state.web3Modal = web3Modal
    },
    setLibrary(state, library) {
      state.library = library
    },
    setActive(state, active) {
      state.active = active
    },
    setAccount(state, account) {
      state.account = account
    },
    setBalance(state, balance) {
      state.balance = balance
    },
    setChainId(state, chainId) {
      state.chainId = chainId
    }
  },
  actions: {
    async connect({ state, commit, dispatch }) {
      const provider = await state.web3Modal.connect()
      const library = new ethers.providers.Web3Provider(provider)

      console.log('WalletConnect Action');

      library.pollingInterval = 12000
      commit("setLibrary", library)
      console.log(library);

      const accounts = await library.listAccounts()
      if (accounts.length > 0) {
        console.log(accounts);
        commit("setAccount", accounts[0])
      }

      await library.getBalance(accounts[0]).then((result) => {
        commit("setBalance", ethers.utils.formatEther(result, 'ether'))
      });
     
      const network = await library.getNetwork()
      commit("setChainId", network.chainId)
      commit("setActive", true)

      provider.on("connect", async (info) => {
        const chainId = parseInt(info.chainId)
        commit("setChainId", chainId)
        console.log("connect", info)
      })

      provider.on("disconnect", async (code, reason) => {
        console.log(code, reason);
        console.log("disconnected");
        commit("setActive", false)
        commit("setAccount", null)
        commit("setBalance", 0)
        //localStorage.removeItem("userState");
      });

      provider.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          commit("setAccount", accounts[0])
        } else {
          await dispatch("resetApp")
        }
        console.log("accountsChanged")
      })
      provider.on("chainChanged", async (chainId) => {
        chainId = parseInt(chainId)
        commit("setChainId", chainId)
        console.log("chainChanged", chainId)
      })
    },
    async resetApp({ state, commit }) {
      try {
        await state.web3Modal.clearCachedProvider()
      } catch (error) {
        console.error(error)
      }
      commit("setAccount", null)
      commit("setActive", false)
      commit("setLibrary", getLibrary())
    }
  }
}
export default web3ModalStore