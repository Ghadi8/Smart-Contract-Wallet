// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./SimpleAccount.sol";

interface ISimpleAccount {
    function initialize(address entrypoint, address owner) external;
}

/**
 * A sample factory contract for SimpleAccount
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract SimpleAccountFactory is Ownable {
    /// @notice cheaply clone contract functionality in an immutable way
    using Clones for address;

    address private SimpleAccountAddress;

    address[] public children;

    SimpleAccount public accountImplementation;

    /// @notice Event emitted on new proxy creation
    event NewSimpleAccount(address indexed _simpleAccount);

    constructor(address _SimpleAccountAddress) {
        SimpleAccountAddress = _SimpleAccountAddress;
    }

    /**
     * @notice change base address
     **/
    function changeBaseAccountAddress(address newAddr) external onlyOwner {
        SimpleAccountAddress = newAddr;
    }

    /**
     * create an account, and return its address.
     * returns the address even if the account is already deployed.
     * Note that during UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation
     */
    function createAccount(address entrypoint, bytes32 salt)
        external
        onlyOwner
    {
        address identicalChild = SimpleAccountAddress.cloneDeterministic(salt);

        children.push(identicalChild);

        ISimpleAccount(identicalChild).initialize(entrypoint, msg.sender);

        emit NewSimpleAccount(identicalChild);
    }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(bytes32 salt) external view returns (address) {
        address simpleAccountAddress = Clones.predictDeterministicAddress(
            SimpleAccountAddress,
            salt
        );
        return simpleAccountAddress;
    }
}
