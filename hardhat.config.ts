import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    testnet: {
      url: 'http://31.131.26.13:8545',
      chainId: 211323,
      gasPrice: 0,
      // This is not optimal but required to run contracts with unknown GAS
      gas: 30000,
      accounts: [
        '8bbbb1b345af56b560a5b20bd4b0ed1cd8cc9958a16262bc75118453cb546df7',
      ],
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.15',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  docgen: {
    only: [
      '^contracts/UserGroups*',
      '^contracts/UserPasswords*',
      '^contracts/DeviceActivity*'
    ],
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
