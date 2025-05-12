import { WalletButton } from "./solana/solana-provider";
import AnimatedHeartLogo from "./AnimatedLogo";

export default function WalletConnect() {
  return (
    <div className="h-[100svh] flex flex-col items-center justify-center bg-black text-gold-500 p-6">
      {/* Pierced Heart Logo */}

      {/* Wallet Connect Box */}
      <div className="bg-[#1a0e05] border border-[#d3af37] shadow-gold rounded-2xl p-8 text-center w-full max-w-md">
      <div className="flex justify-center mb-4">
        <AnimatedHeartLogo />
      </div>
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-[#d3af37] drop-shadow-lg">
          Connect Your Wallet
        </h1>
        <p className="text-[#f5deb3] mt-2 text-base">
          Shinzoku warriors await your command.
        </p>

        {/* Wallet Button */}
        <div className="mt-8">
          <WalletButton className="!bg-[#d3af37] !hover:bg-[#ae8625] !text-black !px-6 !py-3 !rounded-lg !text-lg !font-bold !transition-all !duration-300 !shadow-lg !hover:shadow-red-500/50" />
        </div>

        {/* Subtext */}
        <p className="text-sm text-[#c0a96d] mt-4">
          We recommend Phantom for the best experience
        </p>
      </div>
    </div>
  );
}
