import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletConnect() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6">
      {/* Wallet Connect Box */}
      <div className="bg-[#121826] border border-[#3b82f6] shadow-lg rounded-2xl p-8 text-center w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[#3b82f6] drop-shadow-lg">
          Connect Your Wallet
        </h1>
        <p className="text-gray-400 mt-2">
          Securely connect your Solana wallet to start your adventure.
        </p>

        {/* Wallet Button */}
        <div className="mt-6">
          <WalletMultiButton className="!bg-[#3b82f6] !hover:bg-[#2563eb] !text-white !px-6 !py-3 !rounded-lg !text-lg !font-bold !transition-all !duration-300 !shadow-lg !hover:shadow-blue-500/50" />
        </div>

        {/* Decorative Effect */}
        <div className="mt-6">
          <span className="block w-16 h-1 bg-[#3b82f6] mx-auto rounded-lg"></span>
        </div>
      </div>
    </div>
  );
}
