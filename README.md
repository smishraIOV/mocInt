# Basic mintable token contract

A contract for local (regtest) testing with mintable tokens (using OpenZep ERC20). Started with the base hardhat setup. Add burning/redeeming later. 

BTC price variable in the contract is uint and assumes 1 BTC >= 1USD. The units here are for RSK, which uses `gwei` as the smallest unit. 

The OZ safe math library is not used. Solidity 8+ will automtically revert on under/overflows. 

## Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
