import React, { Component, Fragment } from 'react'
import factory from '../ethereum/factory'

export default class CampaignIndex extends Component {
  static async getInitialProps() {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns.call();
      console.log(campaigns)
      // return { campaigns }
      return {}
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Fragment>
        test
      </Fragment>
    )
  }
}