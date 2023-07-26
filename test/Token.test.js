const {constants, expectRevert} = require("@openzeppelin/test-helpers")
const {web3} = require("@openzeppelin/test-helpers/src/setup")
const {ZERO_ADDRESS} = constants
const {expect} = require("chai")
const Token = artifacts.require("Token")
const Blacklist = artifacts.require("Blacklist")

contract('Token test', (accounts) => {
    const [deployer, firstAccount, secondAccount, thirdAccount] = accounts

    // beforeEach(async () => {
    //     this.token = await Token.new('test1', 'TST1')
    // })

    it('deployed', async () => {
        this.token = await Token.deployed()
        expect(this.token.address).to.not.equal(ZERO_ADDRESS)
        expect(this.token.address).to.match(/0x[0-9a-fA-F]{40}/)
        console.log('New Token Address ',this.token.address)
        console.log('Token Owner:',await this.token.owner())

        this.blacklist = await Blacklist.deployed()
        expect(this.blacklist.address).to.not.equal(ZERO_ADDRESS)
        expect(this.blacklist.address).to.match(/0x[0-9a-fA-F]{40}/)
        console.log('New Blacklist Address ',this.token.address)
        console.log('Blacklist Owner:',await this.token.owner())
    })

    it('transfer', async () => {
        bal = await this.token.balanceOf(firstAccount)
        console.log('Balance of firstAccount ', web3.utils.fromWei(bal))

        await this.token.mint(secondAccount, web3.utils.toWei('50'), {from: deployer})
        await this.token.mint(firstAccount, web3.utils.toWei('100'), {from: deployer})
        await this.token.mint(deployer, web3.utils.toWei('200'), {from: deployer})
        await this.token.transfer(firstAccount, web3.utils.toWei('10'))

        bal = await this.token.balanceOf(firstAccount)
        console.log('Balance of firstAccount ', web3.utils.fromWei(bal))

        bal = await this.token.balanceOf(deployer)
        console.log('Balance of deployer ', web3.utils.fromWei(bal))
    })

    it('transfer from 2 to 1', async () => {
        bal = await this.token.balanceOf(firstAccount)
        console.log('Balance of firstAccount ', web3.utils.fromWei(bal))

        await this.token.transfer(firstAccount, web3.utils.toWei('10'), {from: secondAccount})

        bal = await this.token.balanceOf(firstAccount)
        console.log('Balance of firstAccount ', web3.utils.fromWei(bal))

        bal = await this.token.balanceOf(secondAccount)
        console.log('Balance of secondAccount ', web3.utils.fromWei(bal))
    })

    it('transferFrom', async () => {
        await this.token.approve(secondAccount, web3.utils.toWei('30'), {from: firstAccount})
        await this.token.transferFrom(firstAccount, secondAccount, web3.utils.toWei('20'), {from: secondAccount})

        bal = await this.token.balanceOf(firstAccount)
        console.log('Balance of firstAccount ', web3.utils.fromWei(bal))

        bal = await this.token.balanceOf(secondAccount)
        console.log('Balance of secondAccount ', web3.utils.fromWei(bal))
    })

    it('insert user in blacklist', async () => {
        await this.blacklist.allowedToken(this.token.address, {from: deployer})
        await this.token.insertInBlackList(thirdAccount, {from: deployer})
        console.log(await this.blacklist.getBlacklistStatus(thirdAccount))
    })

    it('transfer to user in blacklist', async () => {
        await expectRevert(this.token.mint(thirdAccount, web3.utils.toWei('10'), {from: deployer}), 'Recipient is blacklisted')
    })

    it('insert secondUser in blacklist', async () => {
        await this.token.insertInBlackList(secondAccount, {from: deployer})
        console.log(await this.blacklist.getBlacklistStatus(secondAccount))
    })

    it('transfer from user in blacklist', async () => {
        await expectRevert(this.token.transfer(firstAccount, web3.utils.toWei('10'), {from: secondAccount}), 'Sender is blacklisted')
    })

    it('remove user from blacklist', async () => {
        await this.token.removeFromBlackList(thirdAccount, {from: deployer})
        console.log(await this.blacklist.getBlacklistStatus(thirdAccount))
    })

    it('transfer to user not in blacklist', async () => {
        await this.token.transfer(thirdAccount, web3.utils.toWei('10'), {from: deployer})
    })
})