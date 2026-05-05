// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DegenDNA is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public mintPrice;
    uint256 private _nextTokenId;

    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public tokenOf;
    mapping(address => string) public personalityOf;

    event PersonalityMinted(
        address indexed wallet,
        uint256 indexed tokenId,
        string personalityType,
        string tokenURI
    );

    constructor(uint256 _mintPrice) ERC721("DegenDNA", "DDNA") Ownable(msg.sender) {
        mintPrice = _mintPrice;
        _nextTokenId = 1;
    }

    function mintPersonalityNFT(
        string calldata tokenURI_,
        string calldata personalityType
    ) external payable nonReentrant {
        require(msg.value >= mintPrice, "UNDERPAID");
        require(!hasMinted[msg.sender], "ALREADY_MINTED");
        require(bytes(tokenURI_).length > 0, "EMPTY_URI");
        require(bytes(personalityType).length > 0, "EMPTY_PERSONALITY");

        uint256 tokenId = _nextTokenId++;
        hasMinted[msg.sender] = true;
        tokenOf[msg.sender] = tokenId;
        personalityOf[msg.sender] = personalityType;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit PersonalityMinted(msg.sender, tokenId, personalityType, tokenURI_);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = payable(owner()).call{value: address(this).balance}("");
        require(ok, "WITHDRAW_FAILED");
    }
}
