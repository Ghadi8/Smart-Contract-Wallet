# Smart-Contract-Wallet
The Smart Contract Wallet is a simple implementation of Account Abstraction based on eth-infinitism contracts. It allows users to create smart contract wallets and perform transactions using Ether and ERC20 tokens.

## Installation

To install the Smart Contract Wallet, follow these steps:

Clone the repository to your local machine.
Navigate to the "example-functionality" directory.
Run the command "npm install" to install the required dependencies.
Run the command "npm run start" to start the server locally on port 3000.

## Usage

The Smart Contract Wallet provides the following methods:

### getAddress(index)

Creates a smart contract wallet with the specified index.

- Params: index

Request:

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "getAddress",
 "params": {
   "index": 0,
        }
}
```

### withdrawETH(index, to, amount)

Withdraws Eth from the specified smart contract wallet and sends it to the specified address.

- Params: index, to, amount

Request

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "withdrawETH",
 "params": {
   "index": 0,
   "to": "0x02a33d9Ab48A39D97bcBD5468bc42Fb6E794bd0D",
   "amount": 0.02
        }
}
```

### withdrawERC20(index, to, amount, tokenAddress)

Withdraws ERC20 tokens from the specified smart contract wallet and sends them to the specified address.

- Params: index, to, amount, tokenAddress

Request

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "withdrawERC20",
 "params": {
   "index": 0,
   "to": "0x02a33d9Ab48A39D97bcBD5468bc42Fb6E794bd0D",
   "amount": 2000000000,
   "tokenAddress": "0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7"
        }
}
```

### Batch Transactions Implemented but not functional yet due to issue with eth-infinitism/bundler 

https://github.com/stackup-wallet/erc-4337-examples/issues/18

## TODO: Add Paymaster functionality
