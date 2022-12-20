require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ganache");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
const PrivateKey = process.env.PRIVKEY;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    development: {
      url: "http://127.0.0.1:7545",
      chainId: 5777
      // accounts: [privateKey1, privateKey2, ...]
  },
  next: {
    url: "https://rpc.nextsmartchain.com",
    chainid: 96,
    allowUnlimitedContractSize: true,
    gasPrice: 20000000000,
    gas: 6000000,
    accounts: [PrivateKey]
  },
 }  
};
