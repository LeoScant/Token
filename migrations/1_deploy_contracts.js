const Token = artifacts.require("Token");
const Blacklist = artifacts.require("Blacklist");

module.exports = async(deployer) => {
    await deployer.deploy(Blacklist);
    const blacklist = await Blacklist.deployed();       
    console.log("Blacklist deployed at address:", blacklist.address);

    await deployer.deploy(Token, 'test1', 'TST1', blacklist.address);
    const token = await Token.deployed();       
    console.log("Token deployed at address:", token.address);
};