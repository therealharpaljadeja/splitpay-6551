pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PNFT is ERC721, ERC721Enumerable {
    uint256 public tokenId = 0;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }

    function mint(address _to) external {
        _safeMint(_to, tokenId);
        tokenId++;
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function _update(
        address to,
        uint256 _tokenId,
        address auth
    ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, _tokenId, auth);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
