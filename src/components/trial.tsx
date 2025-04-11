import React from "react";

const Scoreboard = () => {
  return (
    <div className="w-[460px] rounded-[32px] bg-[#1a1a1a] text-white font-sans p-5 mx-auto shadow-[0_8px_16px_rgba(0,0,0,0.4)] overflow-hidden my-10">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-6 bg-[#2b2b2b] rounded-t-[32px]">
        <button className="text-sm text-[#f0f0f0] cursor-pointer bg-[#444] py-1.5 px-3 rounded-[20px]">
          Hide
        </button>
        <div className="text-center">
          <div className="text-xl font-bold mb-1">Stamford Bridge</div>
          <div className="text-sm text-[#bbb]">Week 10</div>
        </div>
        <button className="text-sm text-[#f0f0f0] cursor-pointer bg-[#444] py-1.5 px-3 rounded-[20px]">
          Match
        </button>
      </div>

      {/* Score Section */}
      <div className="flex justify-around items-center p-5 bg-gradient-to-r from-[#2a2a2a] via-[#3a5a3a] to-[#2a2a2a] rounded-[24px] my-4 mx-5">
        {/* Left Team */}
        <div className="flex flex-col items-center w-[120px]">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
            alt="Real Madrid"
            className="w-[50px] h-[50px] mb-2 object-contain"
          />
          <div className="text-base font-medium mb-1">Real Madrid</div>
          <div className="text-xs text-[#aaa]">Home</div>
        </div>

        {/* Center Score */}
        <div className="flex flex-col items-center w-[80px]">
          <div className="text-[32px] font-bold mb-1">0 : 1</div>
          <div className="text-sm text-[#0f0]">90 + 4</div>
        </div>

        {/* Right Team */}
        <div className="flex flex-col items-center w-[120px]">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg"
            alt="Barcelona"
            className="w-[50px] h-[50px] mb-2 object-contain"
          />
          <div className="text-base font-medium mb-1">Barcelona</div>
          <div className="text-xs text-[#aaa]">Away</div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
