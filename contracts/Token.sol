// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";

contract Token is ERC20, Ownable{
    IBlacklist public blacklistContract;

    event TokensMinted(address indexed account, uint256 amount);
    event TokensBurned(address indexed account, uint256 amount);
    event AddedToBlacklist(address indexed user);
    event RemovedFromBlacklist(address indexed user);

    constructor(string memory tokenName, string memory tokenSym, address blAddress) ERC20(tokenName, tokenSym) {
        require(blAddress != address(0), "Invalid blacklist contract address");
        blacklistContract = IBlacklist(blAddress);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
        emit TokensMinted(account, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function insertInBlackList(address user) external onlyOwner {
        blacklistContract.addBlackList(user);
        emit AddedToBlacklist(user);
    }

    function removeFromBlackList(address user) external onlyOwner {
        blacklistContract.removeBlackList(user);
        emit RemovedFromBlacklist(user);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override view{
        amount;
        require(!blacklistContract.getBlacklistStatus(from), "Sender is blacklisted");
        require(!blacklistContract.getBlacklistStatus(to), "Recipient is blacklisted");
    }
}