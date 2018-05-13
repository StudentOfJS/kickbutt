import web3 from './web3'
import { DEPLOYED_TO } from '../constants'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  DEPLOYED_TO
)
export default instance