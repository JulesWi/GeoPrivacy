// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GeoPrivacyPayment is Ownable {
    IERC20 public usdcToken;
    uint256 public constant PROOF_COST = 0.5 * 10**6; // 0.5 USDC

    mapping(address => uint256) public proofTokens;
    
    event ProofTokenPurchased(address indexed user, uint256 amount);
    event ProofTokenConsumed(address indexed user);

    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
    }

    function purchaseProofToken() public {
        require(
            usdcToken.transferFrom(msg.sender, address(this), PROOF_COST), 
            "Payment transfer failed"
        );
        
        proofTokens[msg.sender] += 1;
        emit ProofTokenPurchased(msg.sender, PROOF_COST);
    }

    function validateAndConsumeProofToken(address user) public returns (bool) {
        if (proofTokens[user] > 0) {
            proofTokens[user] -= 1;
            emit ProofTokenConsumed(user);
            return true;
        }
        return false;
    }

    function withdrawUSDC() public onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        usdcToken.transfer(owner(), balance);
    }
}
