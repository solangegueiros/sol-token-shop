interface Props {
  loading: boolean;
  onWithdraw: () => Promise<void>;
}

export function AdminPanel({ loading, onWithdraw }: Props) {
  return (
    <div className="card admin-panel">
      <h2>Owner Panel</h2>
      <p>Withdraw accumulated ETH from the TokenShop contract.</p>
      <button onClick={onWithdraw} disabled={loading} className="btn btn-secondary">
        {loading ? "Processing..." : "Withdraw ETH"}
      </button>
    </div>
  );
}
