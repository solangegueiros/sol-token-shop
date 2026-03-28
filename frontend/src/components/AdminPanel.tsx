interface Props {
  loading: boolean;
  shopEthBalance: string;
  onWithdraw: () => Promise<void>;
}

export function AdminPanel({ loading, shopEthBalance, onWithdraw }: Props) {
  return (
    <div className="card admin-panel">
      <h2>Owner Panel</h2>
      <p>TokenShop balance: <strong>{shopEthBalance} ETH</strong></p>
      <button onClick={onWithdraw} disabled={loading} className="btn btn-secondary">
        {loading ? "Processing..." : "Withdraw ETH"}
      </button>
    </div>
  );
}
