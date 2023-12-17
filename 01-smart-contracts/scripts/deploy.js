// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require('hardhat');
const fs = require("fs");

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const toBytes32 = function (string) {
  return ethers.utils.formatBytes32String(string);
}
const fromBytes32 = function (string) {
  return ethers.utils.parseBytes32String(string);
}

const parseUnits = function (number, units) {
  return ethers.utils.parseUnits(number, units || 8);
}

const formatUnits = function (number, units) {
  return ethers.utils.formatUnits(number, units || 8);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const provider = hre.ethers.provider;
  const signer = await provider.getSigner();

  /*
  await hre.ethers.provider.send('hardhat_setNonce', [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x3b"
  ]);
  return;
  */

  const darkOracleAddress = '0x0f4Ed929a87ab43787cd079A4d0374e9ffc6d47d';

  const account = await signer.getAddress();
  console.log('account', account);
  console.log('Account balance', formatUnits(await provider.getBalance(account)));

  // Router
  const Router = await hre.ethers.getContractFactory("Router");
  const router = await Router.deploy();
  await router.deployed();
  console.log("Router deployed to:", router.address);

  //  const router = {address: '0x513A01327fE042ed729Aa545cc3725F2653bEFd0'}

  // Trading
  const Trading = await hre.ethers.getContractFactory("Trading");
  const trading = await Trading.deploy();
  await trading.deployed();
  console.log("Trading deployed to:", trading.address);
  // const trading = {address: '0xD47844333F98Ae1cc35f3b76f5D702563ef00D58'};


  // Oracle
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  await oracle.deployed();
  console.log("Oracle deployed to:", oracle.address);
  // const oracle = {address: '0xB57D95707229FbB9397F04a14A9A09CaE8aFb0Bc'};


  // Treasury
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log("Treasury deployed to:", treasury.address);

  // const treasury = {address: '0x8991f160A6e0D10803201A8dDA333CB60C350A0c'};

  // AND, USDC mock tokens (local only)

  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const AND = await MockToken.deploy("Anod", "AND", 18 );
  await AND.deployed();

  // const AND = {address: '0xA45C3Dc75D77D3F5Dee29361aa1F5Bf0aFa9BE92'};
  console.log("AND:", AND.address);

  const usdc = await MockToken.deploy("USDC", "USDC", 6 );
  await usdc.deployed();

  // const usdc = {address: '0x3e54904040689F4B58CFd75928f84b2be1F47D67'};
  console.log("usdc:", usdc.address);


  // PoolAND
  const PoolAND = await hre.ethers.getContractFactory("PoolCAP");
  const poolAND = await PoolAND.deploy(AND.address );
  await poolAND.deployed();
  console.log("PoolAND deployed to:", poolAND.address);

  // Pools (WETH, USDC)
  const Pool = await hre.ethers.getContractFactory("Pool");
  
  const poolETH = await Pool.deploy(ADDRESS_ZERO);
  await poolETH.deployed();
  console.log("poolETH deployed to:", poolETH.address);

  const poolUSDC = await Pool.deploy(usdc.address);
  await poolUSDC.deployed();
  console.log("poolUSDC deployed to:", poolUSDC.address);
  
  // Rewards

  const Rewards = await hre.ethers.getContractFactory("Rewards");

  // Rewards for Pools
  const poolRewardsETH = await Rewards.deploy(poolETH.address, ADDRESS_ZERO);
  await poolRewardsETH.deployed();
  console.log("poolRewardsETH deployed to:", poolRewardsETH.address);

  const poolRewardsUSDC = await Rewards.deploy(poolUSDC.address, usdc.address );
  await poolRewardsUSDC.deployed();
  console.log("poolRewardsUSDC deployed to:", poolRewardsUSDC.address);

  // Rewards for AND
  const ANDRewardsETH = await Rewards.deploy(poolAND.address, ADDRESS_ZERO );
  await ANDRewardsETH.deployed();
  console.log("ANDRewardsETH deployed to:", ANDRewardsETH.address);

  const ANDRewardsUSDC = await Rewards.deploy(poolAND.address, usdc.address );
  await ANDRewardsUSDC.deployed();
  console.log("ANDRewardsUSDC deployed to:", ANDRewardsUSDC.address);
  

  // Router setup
  console.log("setting routers");
  await router.setContracts(
    treasury.address,
    trading.address,
    poolAND.address,
    oracle.address,
    darkOracleAddress
  );

  console.log("setting pools");

  await router.setPool(ADDRESS_ZERO, poolETH.address );
  await router.setPool(usdc.address, poolUSDC.address);

  // Fee share setup
  await router.setPoolShare(ADDRESS_ZERO, 5000);
  await router.setPoolShare(usdc.address, 5000);
  console.log("set pool shares");

  await router.setANDShare(ADDRESS_ZERO, 1000);
  await router.setANDShare(usdc.address, 1000);
  console.log("set AND shares");

  await router.setPoolRewards(ADDRESS_ZERO, poolRewardsETH.address);
  await router.setPoolRewards(usdc.address, poolRewardsUSDC.address);

  await router.setANDRewards(ADDRESS_ZERO, ANDRewardsETH.address);
  await router.setANDRewards(usdc.address, ANDRewardsUSDC.address);
  
  console.log("Setup router contracts");

  await router.setCurrencies([ADDRESS_ZERO, usdc.address]);
  console.log("Setup router currencies");

  // Link contracts with Router, which also sets their dependent contract addresses
  console.log("Linking with router");
  await trading.setRouter(router.address);
  await treasury.setRouter(router.address);
  await poolAND.setRouter(router.address);
  await oracle.setRouter(router.address);
  await poolETH.setRouter(router.address);
  await poolUSDC.setRouter(router.address);
  await poolRewardsETH.setRouter(router.address);
  await poolRewardsUSDC.setRouter(router.address);
  await ANDRewardsETH.setRouter(router.address);
  await ANDRewardsUSDC.setRouter(router.address);

  console.log("Linked router with contracts");

  const network = hre.network.name;
  console.log('network', network);

  // Add products

  const products = [
    {
      id: 'ETH-USD',
      maxLeverage: 50,
      fee: 0.1,
      interest: 16,
      liquidationThreshold: 80
    },
    {
      id: 'BTC-USD',
      maxLeverage: 50,
      fee: 0.1,
      interest: 16,
      liquidationThreshold: 80
    }
  ];

  for (const p of products) {
    await trading.addProduct(toBytes32(p.id), [
      parseUnits(""+p.maxLeverage),
      parseInt(p.liquidationThreshold * 100),
      parseInt(p.fee * 10000),
      parseInt(p.interest * 100),
    ]);
    console.log('Added product ' + p.id);
  }

  // Mint some AND, USDC
  await usdc.mint(parseUnits("10000000", 6));
  await AND.mint(parseUnits("1000000", 18));

  fs.writeFileSync(
    "././contracts.js", `
    export const router = "${router.address}"
    export const Trading = "${trading.address}"
    export const oracle = "${oracle.address}"
    export const treasury = "${treasury.address}"
    export const AND = "${AND.address}"
    export const usdc = "${usdc.address}"
    export const PoolAND = "${poolAND.address}"
    export const poolETH = "${poolETH.address}"
    export const poolUSDC = "${poolUSDC.address}"
    export const poolRewardsETH = "${poolRewardsETH.address}"
    export const poolRewardsUSDC = "${poolRewardsUSDC.address}"
    export const ANDRewardsETH = "${ANDRewardsETH.address}"
    export const ANDRewardsUSDC = "${ANDRewardsUSDC.address}"
  
    `
  )


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
