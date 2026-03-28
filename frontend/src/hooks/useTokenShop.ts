import { useState, useEffect, useCallback, useMemo } from "react";
import { Contract, JsonRpcProvider, JsonRpcSigner, formatUnits, parseEther, parseUnits } from "ethers";
import { TOKEN_ABI, TOKEN_SHOP_ABI, ADDRESSES } from "../contracts/abis";
import { SEPOLIA_RPC } from "../config";

export function useTokenShop(signer: JsonRpcSigner | null, account: string | null) {
  const [shopAddress, setShopAddress] = useState<string>(ADDRESSES.tokenShop);
  const [tokenAddress, setTokenAddress] = useState<string>(ADDRESSES.token);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [ethPrice, setEthPrice] = useState<string>("0");
  const [tokenPriceUsd, setTokenPriceUsd] = useState<string>("0");
  const [shopEthBalance, setShopEthBalance] = useState<string>("0");
  const [isMinter, setIsMinter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const publicProvider = useMemo(() => new JsonRpcProvider(SEPOLIA_RPC), []);

  const getReadContracts = useCallback(() => {
    if (!tokenAddress || !shopAddress) return null;
    const provider = signer ?? publicProvider;
    return {
      token: new Contract(tokenAddress, TOKEN_ABI, provider),
      shop: new Contract(shopAddress, TOKEN_SHOP_ABI, provider),
    };
  }, [signer, publicProvider, tokenAddress, shopAddress]);

  const getWriteContracts = useCallback(() => {
    if (!signer || !tokenAddress || !shopAddress) return null;
    return {
      token: new Contract(tokenAddress, TOKEN_ABI, signer),
      shop: new Contract(shopAddress, TOKEN_SHOP_ABI, signer),
    };
  }, [signer, tokenAddress, shopAddress]);

  const refresh = useCallback(async () => {
    const contracts = getReadContracts();
    if (!contracts) return;

    try {
      const promises: Promise<unknown>[] = [
        contracts.token.totalSupply(),
        contracts.shop.getChainlinkDataFeedLatestAnswer(),
        contracts.shop.tokenPrice(),
        contracts.token.name(),
        contracts.token.symbol(),
      ];
      const provider = signer?.provider ?? publicProvider;
      promises.push(provider.getBalance(shopAddress)); // [5]
      if (account) {
        promises.push(contracts.token.balanceOf(account)); // [6]
        promises.push(contracts.shop.owner()); // [7]
        promises.push(contracts.token.MINTER_ROLE()); // [8]
      }

      const results = await Promise.all(promises);
      setTotalSupply(formatUnits(results[0] as bigint, 2));
      setEthPrice(formatUnits(results[1] as bigint, 8));
      setTokenPriceUsd(formatUnits(results[2] as bigint, 2));
      setTokenName(results[3] as string);
      setTokenSymbol(results[4] as string);
      setShopEthBalance(formatUnits(results[5] as bigint, 18));

      if (account) {
        setTokenBalance(formatUnits(results[6] as bigint, 2));
        setIsOwner((results[7] as string).toLowerCase() === account.toLowerCase());
        const minterRole = results[8] as string;
        const hasMinterRole = await contracts.token.hasRole(minterRole, account);
        setIsMinter(hasMinterRole);
      }
    } catch (err) {
      console.error("Failed to fetch contract data:", err);
    }
  }, [getReadContracts, account]);

  const updateShopAddress = useCallback(async (newShopAddress: string) => {
    const provider = signer ?? publicProvider;
    const shop = new Contract(newShopAddress, TOKEN_SHOP_ABI, provider);
    let newTokenAddress: string | null = null;
    try {
      newTokenAddress = await shop.token();
    } catch {
      try {
        newTokenAddress = await shop.minter();
      } catch {
        // neither worked
      }
    }
    if (!newTokenAddress) {
      throw new Error("Could not read token address from this TokenShop contract");
    }
    setShopAddress(newShopAddress);
    setTokenAddress(newTokenAddress);
  }, [signer, publicProvider]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  const buyTokens = useCallback(
    async (ethAmount: string) => {
      const contracts = getWriteContracts();
      if (!contracts) return;

      setLoading(true);
      setTxStatus("Sending transaction...");
      try {
        const tx = await signer!.sendTransaction({
          to: shopAddress,
          value: parseEther(ethAmount),
        });
        setTxStatus("Waiting for confirmation...");
        await tx.wait();
        setTxStatus("Purchase successful!");
        await refresh();
      } catch (err: unknown) {
        setTxStatus(`Error: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    },
    [getWriteContracts, signer, refresh]
  );

  const estimateTokens = useCallback(
    async (ethAmount: string): Promise<string> => {
      const contracts = getReadContracts();
      if (!contracts || !ethAmount || parseFloat(ethAmount) <= 0) return "0";

      try {
        const amount = await contracts.shop.tokenAmount(parseEther(ethAmount));
        return formatUnits(amount, 2);
      } catch {
        return "0";
      }
    },
    [getReadContracts]
  );

  const withdraw = useCallback(async () => {
    const contracts = getWriteContracts();
    if (!contracts) return;

    setLoading(true);
    setTxStatus("Withdrawing...");
    try {
      const tx = await contracts.shop.withdraw();
      setTxStatus("Waiting for confirmation...");
      await tx.wait();
      setTxStatus("Withdrawal successful!");
    } catch (err: unknown) {
      setTxStatus(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [getWriteContracts]);

  const mint = useCallback(async (to: string, amount: string) => {
    const contracts = getWriteContracts();
    if (!contracts) return;

    setLoading(true);
    setTxStatus("Minting...");
    try {
      const tx = await contracts.token.mint(to, parseUnits(amount, 2));
      setTxStatus("Waiting for confirmation...");
      await tx.wait();
      setTxStatus("Mint successful!");
      await refresh();
    } catch (err: unknown) {
      setTxStatus(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [getWriteContracts, refresh]);

  return {
    tokenName,
    tokenSymbol,
    tokenAddress,
    shopAddress,
    shopEthBalance,
    tokenBalance,
    totalSupply,
    ethPrice,
    tokenPriceUsd,
    isMinter,
    isOwner,
    loading,
    txStatus,
    buyTokens,
    estimateTokens,
    withdraw,
    mint,
    updateShopAddress,
    refresh,
    configured: Boolean(tokenAddress && shopAddress),
  };
}
