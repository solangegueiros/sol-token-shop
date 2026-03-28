import { useState, useEffect } from "react";
import { CopyAddress } from "./CopyAddress";

interface Props {
  loading: boolean;
  txStatus: string | null;
  shopAddress: string;
  tokenSymbol: string;
  onBuy: (ethAmount: string) => Promise<void>;
  onEstimate: (ethAmount: string) => Promise<string>;
}

export function BuyTokens({ loading, txStatus, shopAddress, tokenSymbol, onBuy, onEstimate }: Props) {
  const [ethAmount, setEthAmount] = useState("");
  const [estimated, setEstimated] = useState("0");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (ethAmount && parseFloat(ethAmount) > 0) {
        const result = await onEstimate(ethAmount);
        setEstimated(result);
      } else {
        setEstimated("0");
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [ethAmount, onEstimate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    await onBuy(ethAmount);
    setEthAmount("");
  };

  return (
    <div className="card buy-tokens">
      <h2>Buy Tokens</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="number"
            step="0.0001"
            min="0"
            placeholder="Amount in ETH"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            disabled={loading}
          />
          <span className="input-suffix">ETH</span>
        </div>
        {parseFloat(estimated) > 0 && (
          <p className="estimate">
            You will receive approximately <strong>{estimated} {tokenSymbol || "TKN"}</strong>
          </p>
        )}
        <button type="submit" disabled={loading || !ethAmount || parseFloat(ethAmount) <= 0} className="btn btn-primary">
          {loading ? "Processing..." : `Buy ${tokenSymbol || "TKN"}`}
        </button>
      </form>
      {txStatus && (
        <p className={`tx-status ${txStatus.startsWith("Error") ? "error" : "success"}`}>
          {txStatus}
        </p>
      )}
      <p className="hint">
        You can also buy tokens sending ETH directly to the Token Shop address:{" "}
        <CopyAddress address={shopAddress} />
      </p>
    </div>
  );
}
