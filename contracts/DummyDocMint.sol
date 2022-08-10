// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A mintable ERC20 contract to simulate minting DOC

contract DummyDocMint is ERC20 {
    
    //owner can change params
    address public owner;
    // BTC price (in DOCs)
    uint256 public btcPrice;  
    //minting fee (in BTC)
    uint256 public fee;
    
    constructor(address _owner, uint256 _fee, uint256 _btcPrice) ERC20("dummyDOC", "DDOC") payable {
        owner = _owner;      //cannot be changed
        fee  = _fee;
        btcPrice = _btcPrice;
    }

    /**
     * @dev Creates `amount` new tokens and allocates to msg.sender
     * - amount is in RBTC and should be less than msg.value. 
     *   1. Convert this to DOC
     *   2. consume minting fee
     *   3. refund remaining RBTC to end user  
     */
    function mintDoc(uint256 _btcToMint) payable public virtual {
        console.log("Value %o", msg.value);
        console.log("btcToMint: %o and fees %o", _btcToMint, fee); 
        //require strictly positive value
        require( msg.value > _btcToMint + fee, "Not enough value to mint");
        uint256 remainder = msg.value - _btcToMint - fee ;
        // mint dummy DOCs
        uint256 amountInDoC = btcPrice * _btcToMint;  //todo SAFE math
        _mint(msg.sender, amountInDoC);
        console.log("Minted %o DOCs", amountInDoC);
        // refund the rest
        bool success;
        (success, ) =  msg.sender.call{value: remainder}("");
        require(success, "Failed to send refund");
        console.log("Amount refunded %o", remainder);
    }

    // Change params
    function setBtcPrice(uint256 _newBtcPrice) public {
        require(msg.sender == owner, "Only owner can reset price");
        btcPrice = _newBtcPrice;
        console.log("New BTC price is %o",btcPrice );
    }

    function setMintFee(uint256 _newFee) public {
        require(msg.sender == owner, "Only owner can reset fee");
        fee = _newFee;
        console.log("New minting fee is %o",fee );
    }

}