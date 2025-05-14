"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const wallet = useWallet();
  const [token, setToken] = useState(null);
  const [signed, setsigned] = useState(false);
  const walletModal = useWalletModal();

  useEffect(() => {
    login();

    async function login() {
      if (
        wallet.connected &&
        wallet.publicKey &&
        !signed &&
        walletModal.visible &&
        !token
      ) {
        const message = `Login to Shinzoku at ${new Date().toISOString()}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await wallet.signMessage(encodedMessage);
        setsigned(!!signature);
        const signatureBs58 = bs58.encode(signature);

        const res = await fetch("http://localhost:5000/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            publicKey: wallet.publicKey.toString(),
            signature: signatureBs58,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          console.log("✅ Logged in");
        } else {
          console.log("❌ Authentication failed");
        }
      }
    }
  }, [wallet.connected, wallet.publicKey]);

  const disconnect = async () => {
    if (wallet.connected) {
      await wallet.disconnect();
    }
  };

  const logout = async () => {
    setToken(null);
    await disconnect();
  };

  return (
    <AuthContext.Provider value={{ logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
