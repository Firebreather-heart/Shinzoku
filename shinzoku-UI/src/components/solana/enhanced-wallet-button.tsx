import { useState, useEffect } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

// Import the base button (but don't use it directly)
const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

// Create an enhanced wallet button wrapper
export function EnhancedWalletButton({
    onConnect,
    className,
    ...props
}: {
    onConnect?: (publicKey: string) => void;
    className?: string;
    [key: string]: any;
}) {
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();
    const [wasConnected, setWasConnected] = useState(false);

    // This effect will detect connection changes
    useEffect(() => {
        if (connected && publicKey && !wasConnected) {
            console.log("Enhanced wallet button detected connection:", publicKey.toString());
            if (onConnect) {
                onConnect(publicKey.toString());
            }
        }
        setWasConnected(connected);
    }, [connected, publicKey, wasConnected, onConnect]);

    // A wrapper that knows when the button is clicked to connect
    const handleClick = () => {
        if (!connected) {
            console.log("Enhanced wallet button opening modal");
            setVisible(true);
        }
    };

    return (
        <div onClick={handleClick}>
            <WalletMultiButton className={className} {...props} />
        </div>
    );
}