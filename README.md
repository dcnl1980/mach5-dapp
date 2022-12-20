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
Call function setPrice (10000000000000000) equal to 0.01 ETH per token 
Call function setMinimum  (9999000000000000) equal to 0.0099 ETH, so minimum is 1 token
Call function setMaximum (5000000000000000000) max 5 ETH
Call function setCap (500000000000000000000) is 500 ETH
Call function startPreSale(1640991600) first is max end (real capped max date)

### During presale
Call function pause(true) makes the presale on pause, preparing for another round.
Call function pause(false) makes the pause undone.
Call function unlock() ends the presale and make the token claimable.

### End of presale
Call function withdrawETHOwner(5000000000000000000) to withdraw 5 ETH to the owner.
Call function withdrawETH(_addr, amount) to witdraw amount of ETH to an address.
Call function withdrawUnsold(_addr, amount) to withdraw the unsold tokens to an address.