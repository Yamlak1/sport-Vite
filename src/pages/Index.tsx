import { WalletCard } from "@/components/WalletCard";
import { TopEvents } from "@/components/TopEvents";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#282C34] pb-24">
      <Navbar />
      <div className=" ">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md px-4">
            <WalletCard />
            {/* Add the ad banner below the wallet card */}
          </div>

          <TopEvents />
        </div>
      </div>
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
