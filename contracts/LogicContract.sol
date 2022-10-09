// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";


contract TokenV1 is 
  Initializable, 
  ERC20Upgradeable,
  OwnableUpgradeable {

   /**
   * @dev disable the `initialize` function for the origin contract
   * @custom:oz-upgrades-unsafe-allow constructor
   */
    constructor() {
        _disableInitializers();
    }

    /**
    * @dev Executed only once as the constructor()    
    */
    function initialize() public initializer {
       __ERC20_init("Token", "TKN");
       __Ownable_init();
       _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external virtual onlyOwner {
        _mint(to, amount);
    }
}

contract TokenV2 is TokenV1, PausableUpgradeable {
    
    uint8 private constant VERSION = 2;
    function mint(address to, uint256 amount) external override whenNotPaused onlyOwner {
        _mint(to, amount);
    }

    function pauseInit() external reinitializer(VERSION){
        __Pausable_init();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}