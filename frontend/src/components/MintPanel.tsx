import { useState } from "react";

interface Props {
  loading: boolean;
  tokenSymbol: string;
  onMint: (to: string, amount: string) => Promise<void>;
}

export function MintPanel({ loading, tokenSymbol, onMint }: Props) {
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintTo || !mintAmount) return;
    await onMint(mintTo, mintAmount);
    setMintAmount("");
  };

  return (
    <div className="card">
      <h2>Minter Panel</h2>
      <form onSubmit={handleMint}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Receiver address (0x...)"
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
          <span className="input-suffix">{tokenSymbol || "TKN"}</span>
        </div>
        <button type="submit" disabled={loading || !mintTo || !mintAmount} className="btn btn-secondary">
          {loading ? "Processing..." : "Mint"}
        </button>
      </form>
    </div>
  );
}
