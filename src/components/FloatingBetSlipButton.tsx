// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { X } from "lucide-react";
// import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// import { removeBet } from "@/redux/slices/betSlipSlice";
// import { updateBalance } from "@/redux/slices/playerSlice";
// import { createBet } from "@/services/betServices";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// // Define your bet type (adjust fields as needed)
// interface Bet {
//   fixtureId: number;
//   homeTeam: string;
//   awayTeam: string;
//   type: string;
//   option: string;
//   odd: number;
// }

// export const FloatingBetSlipButton = () => {
//   const betSlip = useAppSelector((state) => state.betSlip);
//   // Only render if there is at least one bet in Redux
//   if (betSlip.selectedBets.length === 0) return null;

//   // Set a mobile-friendly default: bottom-right corner.
//   const initialX = typeof window !== "undefined" ? window.innerWidth - 80 : 20;
//   const initialY =
//     typeof window !== "undefined" ? window.innerHeight - 80 : 300;
//   const [position, setPosition] = useState({ x: initialX, y: initialY });
//   const [isDragging, setIsDragging] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [stake, setStake] = useState<number>(5);
//   const [stakeError, setStakeError] = useState("");
//   const dispatch = useAppDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { balance } = useAppSelector((state) => state.user);

//   // This ref will store the offset between pointer and button's top-left
//   const startPos = useRef({ x: 0, y: 0 });

//   // Mouse event handlers
//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     startPos.current = {
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     };
//   };

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!isDragging) return;
//     setPosition({
//       x: e.clientX - startPos.current.x,
//       y: e.clientY - startPos.current.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   // Touch event handlers for mobile
//   const handleTouchStart = (e: React.TouchEvent) => {
//     setIsDragging(true);
//     const touch = e.touches[0];
//     startPos.current = {
//       x: touch.clientX - position.x,
//       y: touch.clientY - position.y,
//     };
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isDragging) return;
//     const touch = e.touches[0];
//     setPosition({
//       x: touch.clientX - startPos.current.x,
//       y: touch.clientY - startPos.current.y,
//     });
//   };

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };

//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     } else {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   const handleConfirmBet = async () => {
//     if (betSlip.selectedBets.length === 0) return;
//     if (stake < 5) {
//       setStakeError("Minimum stake is 5 birr");
//       return;
//     }
//     if (stake > balance) {
//       setStakeError("Insufficient balance");
//       return;
//     }
//     try {
//       await Promise.all(
//         betSlip.selectedBets.map((bet: Bet) =>
//           createBet(
//             { fixtureId: bet.fixtureId },
//             [{ type: bet.type, option: bet.option }],
//             stake
//           )
//         )
//       );
//       // dispatch(updateBalance(balance - stake * betSlip.selectedBets.length));
//       toast({
//         title: "Bets placed successfully!",
//         description: "You can view your bets in the betting history.",
//       });
//       setIsDialogOpen(false);
//     } catch (error) {
//       toast({
//         title: "Error placing bets",
//         description:
//           error instanceof Error ? error.message : "An error occurred",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <>
//       {/* Floating draggable button */}
//       <div
//         onMouseDown={handleMouseDown}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//         onClick={() => {
//           // Only open the dialog if not dragging
//           if (!isDragging) {
//             setIsDialogOpen(true);
//           }
//         }}
//         style={{
//           position: "fixed",
//           left: position.x,
//           top: position.y,
//           zIndex: 1000,
//           cursor: isDragging ? "grabbing" : "grab",
//         }}
//         className="p-3 bg-[#FACD6A] rounded-full shadow-lg"
//       >
//         <span className="text-black font-bold">
//           Bet Slip ({betSlip.selectedBets.length})
//         </span>
//       </div>

//       {/* Bet confirmation dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="w-[90%] max-w-sm mx-auto bg-white text-gray-900 border border-gray-700 rounded-lg">
//           <DialogHeader>
//             <DialogTitle>Confirm Your Bets</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {betSlip.selectedBets.map((bet: Bet) => (
//               <div
//                 key={bet.fixtureId}
//                 className="bg-[#FACD6A] p-4 rounded-lg relative"
//               >
//                 <button
//                   onClick={() => dispatch(removeBet(bet.fixtureId))}
//                   className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
//                 >
//                   <X className="w-4 h-4 text-gray-700" />
//                 </button>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm font-medium">
//                     {bet.homeTeam} vs {bet.awayTeam}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">{bet.type}</p>
//                     <p className="text-sm text-gray-900">{bet.option}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-xl">X{bet.odd}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div className="space-y-3">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="stake"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Stake Amount (Min: 5 birr)
//                 </label>
//                 <input
//                   type="number"
//                   id="stake"
//                   value={stake || ""}
//                   onChange={(e) => setStake(Number(e.target.value))}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FACD6A] focus:border-transparent"
//                 />
//                 {stakeError && (
//                   <p className="text-red-500 text-sm mt-1">{stakeError}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="ghost"
//               onClick={() => setIsDialogOpen(false)}
//               className="w-full"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleConfirmBet}
//               className="w-full bg-[#FACD6A] hover:bg-[#FACD6A]/50"
//               disabled={
//                 stake < 5 ||
//                 stake > balance ||
//                 betSlip.selectedBets.length === 0
//               }
//             >
//               Confirm Bets ({betSlip.selectedBets.length})
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
