import axios from "axios";

const baseUrl =
  // "https://sports-backend-nest-584017102322.us-central1.run.app/players";
  "http://localhost:3000/players";

export interface Player {
  _id: string;
  telegramId: string;
  name: string;
  phoneNumber: string;
  inviterId: string | null;
  isBanned: boolean;
  preferredLanguage: string | null;
  balance: number;
  rewardBalance: number;
  registeredAt: string;
}

export async function registerPlayer(authDto: {
  telegramId: string;
  name: string;
  phoneNumber: string;
  inviterId: string;
  isBanned: boolean;
  preferredLanguage: string;
  registeredAt?: Date;
}): Promise<Player> {
  try {
    const response = await axios.post(`${baseUrl}/register`, authDto, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Registered player:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering player:", error);
    throw error;
  }
}

export async function getPlayer(telegramId: string): Promise<Player> {
  console.log("55555");
  try {
    const response = await axios.get(`${baseUrl}/getPlayer/${telegramId}`);
    console.log("Fetched player data:", response.data);
    if (response.data.registeredAt) {
      response.data.registeredAt = new Date(
        response.data.registeredAt
      ).toISOString();
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
}
