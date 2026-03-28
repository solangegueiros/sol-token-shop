import { useState } from "react";

interface Props {
  loading: boolean;
  shopEthBalance: string;
  onWithdraw: () => Promise<void>;
  onMint: (to: string, amount: string) => Promise<void>;
}

export function AdminPanel({ loading, shopEthBalance, onWithdraw, onMint }: Props) {
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintTo || !mintAmount) return;
    await onMint(mintTo, mintAmount);
    setMintAmount("");
  };

  return (
    <div className="card admin-panel">
      <h2>Owner Panel</h2>
      <p>TokenShop balance: <strong>{shopEthBalance} ETH</strong></p>
      <button onClick={onWithdraw} disabled={loading} className="btn btn-secondary">
        {loading ? "Processing..." : "Withdraw ETH"}
      </button>
      <form onSubmit={handleMint} className="mint-form">
        <h3>Mint Tokens</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Recipient address (0x...)"
            value={mintTo}
            onChange={(e) => setMintTo(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            disabled={loading}
          />
          <span className="input-suffix">TKN</span>
        </div>
        <button type="submit" disabled={loading || !mintTo || !mintAmount} className="btn btn-secondary">
          {loading ? "Processing..." : "Mint"}
        </button>
      </form>
    </div>
  );
}
