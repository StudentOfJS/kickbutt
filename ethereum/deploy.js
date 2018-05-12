const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');
require('dotenv').config();
const { INFURA_KEY, INFURA_API } = process.env;

const provider = new HDWalletProvider(
  INFURA_KEY,
  INFURA_API
);

const web3 = new Web3(provider);

const deploy = async () => {
  let accounts;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (error) {
    console.log(error)
  }

  try {
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: `0x${compiledFactory.bytecode}` })
      .send({
        gas: '1000000',
        from: accounts[0]
      });

    console.log('Contract deployed to', result.options.address);
  } catch (error) {
    console.log(error)
  }
};
deploy();

