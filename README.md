# Sol Token Shop

[solange.dev](https://solange.dev/)

Would you like to know the upcoming events by Sol?

Follow on [Sol's twitter](https://twitter.com/solangegueiros) 

### Ethereum Sepolia Example

- [Token](https://eth-sepolia.blockscout.com/address/0x534d8463f615Ed4c59b6C2a3cB60d0c4Cb45cB3D)
- [TokenShop](https://eth-sepolia.blockscout.com/address/0x7Df66cff401314B752C54FA2976409aB8aF0e8b9)


## Frontend - Features

Features
- Wallet connection with automatic Sepolia network switching
- Live token info - total supply, current ETH/USD price from Chainlink, token price, your token balance
- Buy tokens - enter ETH amount, see estimated token amount you can buy before confirming
- Owner panel (only visible to contract owner)
  - withdraw accumulated ETH
  - mint tokens
- Auto-refresh every 15 seconds

## Local Run

1. Copy .env.example to .env and set your deployed contract addresses:

TOKEN_ADDRESS=0x...

TOKEN_SHOP_ADDRESS=0x...


2. First time - Install dependancies

```cmd
cd frontend
npm install
```

3. Run

On frontend folder

```cmd
cd frontend
```

```cmd
npm run dev
```

4. Open

[http://localhost:5173/](http://localhost:5173/)


## Production - Publish

```cmd
npm run build
```
