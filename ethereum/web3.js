import Web3 from 'web3'
import { INFURA_API } from '../constants'
const web3Creator = () =>
  typeof window !== 'undefined' && typeof window.web3 !== 'undefined'
    ? new Web3(window.web3.currentProvider) // in browser and metamask is running
    : new Web3(new Web3.providers.HttpProvider(INFURA_API)) //  on server or no metamask

let web3 = web3Creator()

export default web3