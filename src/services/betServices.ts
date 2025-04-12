import axios from "axios";
// const baseUrl =
("https://sports-backend-nest-584017102322.us-central1.run.app/bets");
// const baseUrl = "http://localhost:3000/bets";

export async function saveBet(
  betData: any,
  p0: { type: string; option: string }[],
  stake: number
) {
  try {
    console.log(betData);
    const response = await axios.post(`${baseUrl}/saveBet`, betData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error saving bet: ", error);
    throw error;
  }
}

export async function getBets(telegramId: string) {
  try {
    const response = await axios.get(`${baseUrl}/getBets/${telegramId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bets :", error);
    throw error;
  }
}

export async function betResult(betId: string) {
  try {
    const response = await axios.get(`${baseUrl}/betResult/${betId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bet result:", error);
    throw error;
  }
}
