import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useTokenShop } from "./hooks/useTokenShop";
import { ConnectWallet } from "./components/ConnectWallet";
import { TokenInfo } from "./components/TokenInfo";
import { BuyTokens } from "./components/BuyTokens";
import { AdminPanel } from "./components/AdminPanel";
import { CopyAddress } from "./components/CopyAddress";
import "./App.css";

function App() {
  const { account, signer, error, connecting, connect } = useWallet();
  const {
    tokenName,
    tokenSymbol,
    tokenAddress,
    shopAddress,
    tokenBalance,
    totalSupply,
    ethPrice,
    tokenPriceUsd,
    isOwner,
    loading,
    txStatus,
    buyTokens,
    estimateTokens,
    withdraw,
    updateShopAddress,
    configured,
  } = useTokenShop(signer, account);

  const [editing, setEditing] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const handleEdit = () => {
    setEditAddress(shopAddress);
    setEditError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateShopAddress(editAddress);
      setEditing(false);
      setEditError(null);
    } catch (err: unknown) {
      setEditError((err as Error).message);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditError(null);
  };

  return (
    <div className="app">
      <header>
        <h1>Token Shop</h1>
        <p className="subtitle">Buy tokens with ETH on Sepolia</p>
      </header>

      {!configured && account && (
        <div className="card warning">
          <h2>Configuration Required</h2>
          <p>
            Set your contract addresses in <code>.env</code>:
          </p>
          <pre>
            TOKEN_ADDRESS=0x...{"\n"}
            TOKEN_SHOP_ADDRESS=0x...
          </pre>
        </div>
      )}

      {configured && (
        <main>
          <div className="card contracts-box">
            <div className="contract-row">
              <span className="label">{tokenName} ({tokenSymbol}):</span>
              <CopyAddress address={tokenAddress} />
            </div>
            <div className="contract-row">
              <span className="label">Token Shop:</span>
              {editing ? (
                <span className="edit-address">
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="0x..."
                  />
                  <button className="btn-copy" onClick={handleSave}>Save</button>
                  <button className="btn-copy" onClick={handleCancel}>Cancel</button>
                </span>
              ) : (
                <>
                  <CopyAddress address={shopAddress} />
                  <button className="btn-copy" onClick={handleEdit}>Edit</button>
                </>
              )}
            </div>
            {editError && <p className="error">{editError}</p>}
          </div>
          <TokenInfo
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            totalSupply={totalSupply}
            ethPrice={ethPrice}
            tokenPriceUsd={tokenPriceUsd}
            tokenBalance={account ? tokenBalance : undefined}
          />
          
          {account ? (
            <>
              <BuyTokens loading={loading} txStatus={txStatus} shopAddress={shopAddress} onBuy={buyTokens} onEstimate={estimateTokens} />
              {isOwner && <AdminPanel loading={loading} onWithdraw={withdraw} />}
            </>
          ) : (
            <div className="card">
              <p>Connect your wallet to buy tokens, <br />or send ETH directly to the Token Shop address</p>              
            </div>
          )}
          <ConnectWallet account={account} connecting={connecting} error={error} onConnect={connect} />
        </main>
      )}
    </div>
  );
}

export default App;
