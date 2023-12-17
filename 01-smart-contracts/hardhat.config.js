require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "mode",
  networks: {
    hardhat: {
   
    },
  mode: {
    chainId: 919,
    url: 'https://sepolia.mode.network',
    accounts: [process.env.PRIVATE_KEY],

  },

  },
 
  solidity: {
    compilers: [{
      version: "0.8.2",
      settings: {
        optimizer: {
          enabled: true,
          runs: 3000
        }
      }
    }]
  }
};
