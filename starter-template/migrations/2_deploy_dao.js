var arcContracts = require('../arc.json');

var Avatar = artifacts.require('@daostack/arc/Avatar.sol');
var DaoCreator = artifacts.require('@daostack/arc/DaoCreator.sol');

const GAS_LIMIT = 5900000;

// Organization parameters:
// The DAO name
const orgName = 'soul-coin';
// The DAO's token name
const tokenName = 'soul-coin';
// Token symbol
const tokenSymbol = 'SOUL';
// The ethereum addresses of the "founders"
var founders = [
  '0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae',
  '0x9c7f9f45a22ad3d667a5439f72b563df3aa70aae'
];
// NOTE: the important thing is to make sure the array length match the number of founders
var foundersTokens = [1000, 1000, 1000, 1000, 1000, 1000];
//reputation per founder
var foundersRep = [10, 10, 10, 10, 10, 10];

module.exports = async function(deployer) {
  deployer.then(async function() {
    // TODO: edit this switch command based on the comments at the variables decleration lines
    var networkId;
    switch (deployer.network) {
      case 'ganache':
      case 'development':
        networkId = 'ganache';
        break;
      case 'kovan':
      case 'kovan-infura':
        networkId = 'kovan';
        break;
    }

    var daoCreatorInst = await DaoCreator.at(
      arcContracts.DaoCreator[networkId]
    );

    // Create DAO:
    var returnedParams = await daoCreatorInst.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founders,
      foundersTokens, // Founders token amounts
      foundersRep, // Founders initial reputation
      0, // 0 because we don't use a UController
      0, // no token cap
      { gas: GAS_LIMIT }
    );
    var avatarInst = await Avatar.at(returnedParams.logs[0].args._avatar); // Gets the Avatar address

    var schemesArray = []; // The addresses of the schemes
    const paramsArray = []; // Defines which parameters should be grannted for each of the schemes
    const permissionArray = []; // The permissions for the schemes

    // set the DAO's initial schmes:
    await daoCreatorInst.setSchemes(
      avatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray
    ); // Sets the scheme in our DAO controller by using the DAO Creator we used to forge our DAO
  });
};
