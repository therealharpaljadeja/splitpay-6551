pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract Products is ERC1155, ERC1155URIStorage {
    struct Product {
        string name;
        uint256 price;
        address recipient;
        string image;
    }

    uint256 public products = 0;
    mapping(uint256 => Product) _tokenURIs;

    event ProductCreated(uint256 productId);
    event ProductMinted(uint256 productId);

    constructor(string memory _uri) ERC1155(_uri) {}

    function productDetails(
        uint256 tokenId
    ) public view virtual returns (Product memory) {
        return _tokenURIs[tokenId];
    }

    function createProducts(
        string memory _name,
        uint256 _price,
        address _recipient,
        string memory _image
    ) external {
        Product memory product = Product(_name, _price, _recipient, _image);
        _tokenURIs[products] = product;
        emit ProductCreated(products);
        products++;
    }

    function uri(
        uint256 _tokenId
    ) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(_tokenId);
    }

    function mint(address _to, uint256 _tokenId) external {
        _mint(_to, _tokenId, 1, "");
        emit ProductMinted(_tokenId);
    }
}
