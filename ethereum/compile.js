const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname, 'build')

// remove build folder and contents
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8')
const output = solc.compile(source, 1).contracts
// check for build folder and create if non-existent
fs.ensureDirSync(buildPath)

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, `${contract.slice(1)}.json`),
    output[contract]
  )
}