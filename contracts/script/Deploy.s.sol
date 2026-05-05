// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../DegenDNA.sol";

contract Deploy is Script {
    function run() external returns (DegenDNA) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 mintPrice = vm.envOr("MINT_PRICE", uint256(0.001 ether));
        vm.startBroadcast(deployerPrivateKey);
        DegenDNA nft = new DegenDNA(mintPrice);
        vm.stopBroadcast();
        return nft;
    }
}
