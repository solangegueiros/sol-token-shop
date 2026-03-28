interface Props {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  ethPrice: string;
  tokenPriceUsd: string;
  tokenBalance?: string;
}

export function TokenInfo({ tokenName, tokenSymbol, totalSupply, ethPrice, tokenPriceUsd, tokenBalance }: Props) {
  return (
    <div className="card token-info">
      <h2>{tokenName ? `${tokenName}` : "Token Info"}</h2>
      <div className="info-row">
        <div className="info-item">
          <span className="label">Total Supply</span>
          <span className="value">{totalSupply} {tokenSymbol || "TKN"}</span>
        </div>
        <div className="info-item">
          <span className="label">ETH Price</span>
          <span className="value">${parseFloat(ethPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="info-item">
          <span className="label">Token Price</span>
          <span className="value">${tokenPriceUsd} USD</span>
        </div>
        {tokenBalance !== undefined && (
          <div className="info-item">
            <span className="label">Your Balance</span>
            <span className="value">{tokenBalance} {tokenSymbol || "TKN"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
