import { WalletButton } from "./solana/solana-provider";
import AnimatedHeartLogo from "./AnimatedLogo";

export default function WalletConnect() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-gold-500 p-4">
      <div className="w-full max-w-[600px] bg-[#1a0e05] border border-[#d3af37] shadow-gold rounded-2xl p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">
          <AnimatedHeartLogo />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#d3af37] drop-shadow-lg">
          Connect Your Solana Wallet
        </h1>
        <div className="mt-8">
          <WalletButton className="!bg-[#d3af37] !hover:bg-[#ae8625] !text-black !px-8 !py-4 !rounded-lg !text-lg !font-bold !transition-all !duration-300 !shadow-lg !hover:shadow-red-500/50" />
        </div>
        <p className="text-sm text-[#c0a96d] mt-6">
          We recommend Phantom for the best experience
        </p>
      </div>
    </div>
  );
}
