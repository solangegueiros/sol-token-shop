# Sol Token Shop

[solange.dev](https://solange.dev/)

Would you like to know the upcoming events by Sol?

Follow on [Sol's twitter](https://twitter.com/solangegueiros) 

### Ethereum Sepolia

- [Token](https://eth-sepolia.blockscout.com/address/0x534d8463f615Ed4c59b6C2a3cB60d0c4Cb45cB3D)
- [TokenShop](https://eth-sepolia.blockscout.com/address/0x7Df66cff401314B752C54FA2976409aB8aF0e8b9)


## Fronend - Features

Features
- Wallet connection with automatic Sepolia network switching
- Live token info - your TKN balance, current ETH/USD price from Chainlink, token price
- Buy tokens - enter ETH amount, see estimated TKN before confirming
- Owner panel - withdraw accumulated ETH (only visible to contract owner)
- Auto-refresh every 15 seconds

## To run

1. Copy .env.example to .env and set your deployed contract addresses:

VITE_TOKEN_ADDRESS=0x...

VITE_TOKEN_SHOP_ADDRESS=0x...

2. Run

```cmd
cd frontend
npm run dev
```

3. Open

[http://localhost:5173/](http://localhost:5173/)


## Publish

```cmd
npm run build
```
