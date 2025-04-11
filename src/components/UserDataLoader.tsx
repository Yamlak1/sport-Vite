// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { fetchPlayerData } from "@/redux/slices/playerSlice";

// // This component doesn't render anything, it just fetches user data on mount
// const UserDataLoader = () => {
//   const dispatch = useAppDispatch();
//   const { loading, data } = useAppSelector((state) => state.user);

//   useEffect(() => {
//     // Only fetch if we don't already have user data and we're not currently loading
//     if (!data && loading === "idle") {
//       dispatch(fetchPlayerData());
//     }
//   }, [dispatch, data, loading]);

//   return null; // This component doesn't render anything
// };

// export default UserDataLoader;
