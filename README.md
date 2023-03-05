# Smart-Contract-Wallet
Simple Implementation of Account Abstraction based on eth-infinitism contracts

## Setup

```
cd example-functionality
```
Run the app

```
npm run start
```
The server will be running locally on port 3000:

```
http://localhost:3000/sw/
```

## Methods

### getAddress(index)

Creates a smart contract wallet

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

- Params: index, to, amount, tokenAddress

Request

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "withdrawETH",
 "params": {
   "index": 0,
   "to": "0x02a33d9Ab48A39D97bcBD5468bc42Fb6E794bd0D",
   "amount": 2000000000,
   "tokenAddress": "0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7"
        }
}
```


## TODO: Add Paymaster && Aggregator functionality
