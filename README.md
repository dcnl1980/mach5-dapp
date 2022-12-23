# chainjoes-tokensale-dapp-new

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Compile smart contract
```
yarn hardhat compile
```

### Deploy Smart Contract
```
yarn hardhat node
yarn hardhat --network localhost run scripts/deploy.js
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Future implementations
https://github.com/envatic/vue3-web3modal
https://web3modal.com/ (must integrate it)
https://github.com/WalletConnect/web3modal (upgrade to version 2)

### Todo
~~- 1] Fix the store (state.web3Modal.connect is not a function)~~
~~- 2] Make WalletConnect working with Metamask and Coinbase wallet.~~
~~- 3] Install hardhat~~
~~- 4] Compile the contracts~~
~~- 5] Deploy and test in on Localhost~~
- 6] Test buy, presale and claim
- 7] Upload to Mainnet

### Presale parameters
Call function setPrice (2000000000000000) equal to 0.002 ETH per token 
Call function setMinimum  (9999000000000000) equal to 0.0099 ETH, so minimum is 1 token
Call function setMaximum (50000000000000000000) max 50 ETH
Call function setCap (20000000000000000000000) is 20000 ETH
Call function startPreSale(1686528000, 1677628800) first is max end (real capped max date)

enddate = 1 maart 2023 = 1677628800
maxdate = 12 juni 2023 = 1686528000

### During presale
Call function pause(true) makes the presale on pause, preparing for another round.
Call function pause(false) makes the pause undone.
Call function unlock() ends the presale and make the token claimable.

### End of presale
Call function withdrawETHOwner(5000000000000000000) to withdraw 5 ETH to the owner.
Call function withdrawETH(_addr, amount) to witdraw amount of ETH to an address.
Call function withdrawUnsold(_addr, amount) to withdraw the unsold tokens to an address.

### Address on Ethereum

Owner: 0xfa495994E81427ba77390C8fFC84E17693Eb89E8
Token Smart Contract: 0x6969833c846598b937149Db19922315Fd2F8d4bC
PreSale Smart Contract: 0x1b598102ba2dd264011d45f84d5277d784dea88d