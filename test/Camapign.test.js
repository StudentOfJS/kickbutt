const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts, factory, campaignAddress, campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' })

  await factory.methods.createCampaign('101').send({
    from: accounts[0],
    gas: '1000000',
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call()

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress,
  )
})

describe("Camapigns", () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager)
  })

  it('allows people to contribute money and marks them as contributers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    })
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[2],
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy cloth', '101', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal('Buy cloth', request.description)
  })
})