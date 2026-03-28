export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export const TOKEN_SHOP_ABI = [
  "function token() view returns (address)",
  "function minter() view returns (address)",
  "function tokenPrice() view returns (uint256)",
  "function owner() view returns (address)",
  "function getChainlinkDataFeedLatestAnswer() view returns (int256)",
  "function tokenAmount(uint256 amountETH) view returns (uint256)",
  "function withdraw()",
  "receive() external payable",
];

// Update these after deploying your contracts to Sepolia
export const ADDRESSES = {
  token: import.meta.env.TOKEN_ADDRESS || "",
  tokenShop: import.meta.env.TOKEN_SHOP_ADDRESS || "",
};

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
