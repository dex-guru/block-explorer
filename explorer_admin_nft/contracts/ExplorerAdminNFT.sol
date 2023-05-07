pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CustomNFT is ERC721, Ownable {
    using Strings for uint256;

    struct NFTMetadata {
        string title;
        string description;
        string message;
    }

    uint256 public fee;
    uint256 public totalFeesCollected;
    mapping(uint256 => NFTMetadata) public metadata;

    constructor(string memory name, string memory symbol, uint256 _fee) ERC721(name, symbol) {
        fee = _fee;
    }


    function safeMint(address to, uint256 tokenId, string memory title, string memory description, string memory message) public onlyOwner {
        metadata[tokenId] = NFTMetadata(title, description, message);
        _safeMint(to, tokenId);
    }

    function updateMetadata(uint256 tokenId, string memory newTitle, string memory newDescription, string memory newMessage) public payable {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT");
        require(msg.value >= fee, "Insufficient fee");

        metadata[tokenId].title = newTitle;
        metadata[tokenId].description = newDescription;
        metadata[tokenId].message = newMessage;

        totalFeesCollected += msg.value;
    }

    function claimFees() public onlyOwner {
        uint256 amount = totalFeesCollected;
        totalFeesCollected = 0;
        payable(owner()).transfer(amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        NFTMetadata memory tokenMetadata = metadata[tokenId];
        string memory json = string(abi.encodePacked(
            '{',
            '"name": "', tokenMetadata.title, '",',
            '"description": "', tokenMetadata.description, '",',
            '"image": "https://assets.dex.guru/pre_dao_nft/1.png',
            '}'
        ));

        string memory encodedJson = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }
}

library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        uint256 encodedLen = 4 * ((len + 2) / 3);

        bytes memory result = new bytes(encodedLen + 1);
        result[encodedLen] = 0x00;

        for (uint256 i = 0; i < len; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = i + 1 < len ? uint8(data[i + 1]) : 0;
            uint256 c = i + 2 < len ? uint8(data[i + 2]) : 0;

            result[i / 3 * 4] = TABLE[a >> 2];
            result[i / 3 * 4 + 1] = TABLE[((a & 3) << 4) | (b >> 4)];
            result[i / 3 * 4 + 2] = i + 1 < len ? TABLE[((b & 15) << 2) | (c >> 6)] : bytes1(0x3D); // '=' character (padding)
            result[i / 3 * 4 + 3] = i + 2 < len ? TABLE[c & 63] : bytes1(0x3D); // '=' character (padding)
        }

        return string(result);
    }
}


