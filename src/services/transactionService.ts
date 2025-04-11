import axios from "axios";

const baseUrl =
  // "https://sports-backend-nest-584017102322.us-central1.run.app/transactions";
  "http://localhost:3001/transactions";

export async function deposit(
  amount: number,
  firstName: string,
  lastName: string,
  phone: string,
  telegramId: string
) {
  try {
    console.log(amount, firstName, lastName, phone, telegramId);
    const response = await axios.post(`${baseUrl}/deposit`, {
      amount,
      telegramId,
      firstName,
      lastName,
      phone,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error depositing money: ", error);
    throw error;
  }
}

export async function withdraw(
  amount,
  email,
  firstName,
  lastName,
  phone,
  chatId,
  bankAccount,
  bankCode
) {
  try {
    const response = await axios.post(`${baseUrl}/withdraw`, {
      amount,
      email,
      firstName,
      lastName,
      phone,
      chatId,
      bankAccount,
      bankCode,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("error withdrawing money: ", error);
    throw error;
  }
}
