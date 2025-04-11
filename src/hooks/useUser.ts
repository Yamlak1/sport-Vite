import { useAppSelector } from "@/redux/hooks";

// Custom hook to access user data from the Redux store
export const useUser = () => {
  const { data, loading, error } = useAppSelector((state) => state.player);

  // Derive firstName and lastName from the "name" property.
  const firstName = data ? data.name.split(" ")[0] : "";
  const lastName =
    data && data.name.split(" ").length > 1
      ? data.name.split(" ").slice(1).join(" ")
      : "";
  const fullName = data ? data.name : "";

  return {
    user: data,
    isLoading: loading === "pending",
    isAuthenticated: !!data,
    error,
    // Convenience getters based on the provided player data
    firstName,
    lastName,
    fullName,
    balance: data?.balance || 0,
    chatId: data?.telegramId || "",
    // If your API doesn't provide email, this remains empty (or adjust as needed)
    email: data?.email || "",
    // Additional fields from your player data:
    inviterId: data?.inviterId || "",
    isBanned: data?.isBanned || false,
    phoneNumber: data?.phoneNumber || "",
    preferredLanguage: data?.preferredLanguage || "",
    registeredAt: data?.registeredAt || "",
  };
};
