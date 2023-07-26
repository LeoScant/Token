# Token Smart Contract Readme

## Description

This smart contract is an ERC20 token implementation with additional functionalities for blacklist management. The token is based on the OpenZeppelin library and follows the MIT license.

## Features

1. ERC20 Standard: The contract complies with the ERC20 token standard, which ensures compatibility with various wallets, exchanges, and other smart contracts in the Ethereum ecosystem.

2. Minting: The contract owner has the ability to mint new tokens and add them to the circulating supply.

3. Burning: Token holders can burn (destroy) their own tokens, reducing the total supply.

4. Blacklist Management: The contract allows the owner to maintain a blacklist of addresses that are not allowed to send or receive tokens.

## Dependencies

The smart contract relies on the following external dependencies:

- **OpenZeppelin ERC20**: This contract extends the ERC20 implementation from the OpenZeppelin library. The library provides secure and tested ERC20 functionality.
  
- **OpenZeppelin Ownable**: The Ownable contract from OpenZeppelin is used to provide a basic access control mechanism, where the contract owner has administrative privileges.

- **IBlacklist Interface**: An external interface named IBlacklist is used to interact with a separate contract responsible for maintaining the blacklist. This interface must be implemented by the actual blacklist contract.

## Deployment

To deploy this contract, you will need to provide the following parameters:

- `tokenName`: The name of the ERC20 token.
- `tokenSym`: The symbol of the ERC20 token.
- `blAddress`: The address of the deployed blacklist contract that implements the IBlacklist interface.

## Functions

### `constructor(string memory tokenName, string memory tokenSym, address blAddress)`

The constructor initializes the token by setting its name, symbol, and the address of the blacklist contract.

### `mint(address account, uint256 amount) external onlyOwner`

This function allows the contract owner to mint new tokens and add them to the specified account. Only the contract owner can call this function.

### `burn(uint256 amount) external`

Token holders can call this function to burn a specific amount of their tokens, effectively reducing the total supply. The tokens are taken from the sender's account.

### `insertInBlackList(address user) external onlyOwner`

The contract owner can add an address to the blacklist using this function, preventing the blacklisted address from sending or receiving tokens.

### `removeFromBlackList(address user) external onlyOwner`

The contract owner can remove an address from the blacklist using this function, allowing the address to send and receive tokens again.

### `_beforeTokenTransfer(address from, address to, uint256 amount) internal override view`

This internal function is called before any token transfer. It checks whether the sender or recipient address is blacklisted using the `IBlacklist` contract. If either of them is blacklisted, the transfer is reverted with a message indicating that the address is blacklisted.

## Security Considerations

1. **Ownership**: The contract implements the Ownable pattern, which grants administrative privileges to a single owner. Ensure that the owner's private key is adequately protected.

2. **Blacklist Management**: Be cautious when adding or removing addresses from the blacklist, as this can have significant consequences for token holders.

3. **Testing**: Before deploying the contract to the mainnet, thoroughly test it on various testnets to identify and fix any potential bugs or vulnerabilities.

4. **Audit**: Consider conducting a security audit of the contract's code by professional auditors to ensure its safety and robustness.

## License

This smart contract is released under the MIT License, permitting you to use, modify, and distribute the code within the terms and conditions specified in the [MIT License](https://opensource.org/licenses/MIT).