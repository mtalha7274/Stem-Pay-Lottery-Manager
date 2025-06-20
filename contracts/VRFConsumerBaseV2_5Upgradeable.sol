// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @dev Upgradeable-compatible wrapper for Chainlink VRFConsumerBaseV2-like functionality.
 */
abstract contract VRFConsumerBaseV2_5Upgradeable is Initializable {
    error OnlyCoordinatorCanFulfill(address have, address want);

    address private vrfCoordinator;

    function __VRFConsumerBaseV2_5Upgradeable_init(address _vrfCoordinator) internal onlyInitializing {
        vrfCoordinator = _vrfCoordinator;
    }

    /**
     * @notice Override to handle VRF response
     */
    // function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

    // function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external {
    //     if (msg.sender != vrfCoordinator) {
    //         revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
    //     }
    //     fulfillRandomWords(requestId, randomWords);
    // }
}
