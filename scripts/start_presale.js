// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const path = require("path");

// PRESALE VARIABLES
/* global BigInt */
const decimals = 18;
const price    = BigInt(0.00025 * (10**decimals)); // 4000 CJ / ETH
const minBuy   = BigInt(0.01 * (10**decimals)); 
const maxBuy   = BigInt(5 * (10**decimals)); // 5 ETH
const cap      = BigInt(500 * (10**decimals)); // 500 ETH
const endtime  = Math.round(+new Date()/1000+2592000); // 30 days
const maxtime  = Math.round(+new Date()/1000+3000000); // 30 days
console.log(endtime);


async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const presale = await ethers.getContractAt("Presale", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const setPrice = await presale.setPrice(price);
  const setMinimum = await presale.setMinimum(minBuy);
  const setMaximum = await presale.setMaximum(maxBuy);
  const setCap = await presale.setCap(cap);
  //console.log(endtime);
  //console.log(maxtime);
  const startPresale = await presale.startPresale(maxtime, endtime)

  // Send tokens
  //const tokens = await ethers.getContractAt("ChainJoesToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  //const signers = await ethers.getSigners();
  //const [owner, addr1] = signers;
  //await tokens.connect(owner).transfer(addr1.address, 50);
  //await tokens.balanceOf(owner.address)
  //await tokens.balanceOf(addr1.address)
  //const txResponse = await tokens.connect(owner).transfer(addr1.address, 50);
  //await txResponse.wait();
  //console.log('Owner balance: ', await tokens.balanceOf(addr1.address));

  //const Token = await ethers.getContractFactory("ChainJoesToken")
  //const token = Token.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
  //const signers = await ethers.getSigners();
  //const [owner, addr1] = signers;
  //await (await token.connect(owner).transfer(addr1.address, 1000)).wait()

  console.log("TXID Cap:", setCap.hash);

  //const Presale = await ethers.getContractFactory("Presale");
  //const presale = new ethers.Contract(Presale, Presale.interface, deployer);
  //const setCap = await presale.setCap(1000);
  //console.log(setCap);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });