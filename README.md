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

### createAddress(index)

Creates a smart contract wallet

- Params: index

Request:

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "createAddress",
 "params": {
   "index": 0,
        }
}
```

### withdrawEth(index, to, amount)

- Params: index, to, amount

Request

```
 {"jsonrpc" :"2.0",
 "id": 1,
 "method": "withdrawEth",
 "params": {
   "index": 0,
   "to": "0x02a33d9Ab48A39D97bcBD5468bc42Fb6E794bd0D",
   "amount": 0.02
        }
}
```


## TODO: Add Paymaster && Aggregator functionality
