// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";

contract Blacklist is Ownable, IBlacklist {
    mapping(address => bool) public isBlackListed;
    mapping(address => bool) public allowedTokens;

    event DestroyedBlackFunds(address _blackListedUser, uint _balance);
    event AddedBlackList(address _user);
    event RemovedBlackList(address _user);

    constructor() {}

    // Modifier to allow only the owner or allowed tokens to execute certain functions
    modifier onlyOwnerOrAllowed() {
        require(msg.sender==owner() || allowedTokens[msg.sender]);
        _;
    }

    // Function to check if a token is allowed
    function isTokenAllowed(address token) public view returns (bool) {
        return allowedTokens[token];
    }

    // Function to allow a token (onlyOwner can call this)
    function allowToken(address token) external onlyOwner {
        if (token == address(0)) revert('Invalid token address');
        allowedTokens[token] = true;
    }

    // Function to disallow a token (onlyOwner can call this)
    function disallowToken(address token) external onlyOwner {
        if (token == address(0)) revert('Invalid token address');
        allowedTokens[token] = false;
    }

    // Getters to allow the same blacklist to be used also by other contracts
    function getBlacklistStatus(address _maker) external view returns (bool) {
        return isBlackListed[_maker];
    }

    // Function to add an address to the blacklist (onlyOwner or allowed tokens can call this)
    function addBlackList(address _evilUser) external onlyOwnerOrAllowed() {
        isBlackListed[_evilUser] = true;
        emit AddedBlackList(_evilUser);
    }

    // Function to remove an address from the blacklist (onlyOwner or allowed tokens can call this)
    function removeBlackList(address _clearedUser) external onlyOwnerOrAllowed() {
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }
}