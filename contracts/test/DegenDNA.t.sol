// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../DegenDNA.sol";

contract DegenDNATest is Test {
    DegenDNA nft;
    address user = address(0xBEEF);
    uint256 price = 0.001 ether;

    function setUp() public {
        nft = new DegenDNA(price);
        vm.deal(user, 1 ether);
    }

    function testCanMintWithCorrectPrice() public {
        vm.prank(user);
        nft.mintPersonalityNFT{value: price}("data:application/json;base64,abc", "The Sniper");
        assertTrue(nft.hasMinted(user));
        assertEq(nft.tokenOf(user), 1);
        assertEq(nft.personalityOf(user), "The Sniper");
        assertEq(nft.tokenURI(1), "data:application/json;base64,abc");
    }

    function testCannotMintTwice() public {
        vm.startPrank(user);
        nft.mintPersonalityNFT{value: price}("uri", "The Sniper");
        vm.expectRevert("ALREADY_MINTED");
        nft.mintPersonalityNFT{value: price}("uri2", "The Rotator");
        vm.stopPrank();
    }

    function testCannotMintUnderPrice() public {
        vm.prank(user);
        vm.expectRevert("UNDERPAID");
        nft.mintPersonalityNFT{value: price - 1}("uri", "The Sniper");
    }

    function testOwnerCanWithdraw() public {
        vm.prank(user);
        nft.mintPersonalityNFT{value: price}("uri", "The Sniper");
        uint256 beforeBalance = address(this).balance;
        nft.withdraw();
        assertGt(address(this).balance, beforeBalance);
    }

    function testNonOwnerCannotWithdraw() public {
        vm.prank(user);
        vm.expectRevert();
        nft.withdraw();
    }

    receive() external payable {}
}
