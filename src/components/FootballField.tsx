import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shirt, User } from "lucide-react";
import footballFieldSVG from "@/assets/svgviewer-output.svg";

interface Player {
  name: string;
  position: string;
  top: string;
  left: string;
}

interface FootballFieldProps {
  homeTeam: Player[];
  awayTeam: Player[];
  className?: string;
}

function FootballField({ homeTeam, awayTeam, className }: FootballFieldProps) {
  return (
    <div className={`relative w-full h-auto ${className}`}>
      {/* Display the football field svg */}
      <img
        src={footballFieldSVG}
        alt="Football Field"
        className="w-full h-auto"
      />

      {/* Render home team players with red avatars */}
      {homeTeam.map((player, index) => (
        <div
          key={`home-${index}`}
          className="absolute"
          style={{
            top: player.top,
            left: player.left,
            transform: "translate(-50%, -50%)",
          }}
          title={player.name}
        >
          <div className="rotate-[270deg]">
            <Shirt fill="red" stroke="red" width={20} />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
              {index + 1}
            </span>
          </div>
        </div>
      ))}

      {/* Render away team players with blue avatars */}
      {awayTeam.map((player, index) => (
        <div
          key={`away-${index}`}
          className="absolute"
          style={{
            top: player.top,
            left: player.left,
            transform: "translate(-50%, -50%)",
          }}
          title={player.name}
        >
          <div className="rotate-90">
            <Shirt fill="blue" stroke="blue" width={20} />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
              {index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FootballField;
