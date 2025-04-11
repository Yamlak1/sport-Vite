import axios from "axios";
const baseUrl =
  // "https://sports-backend-nest-584017102322.us-central1.run.app/api-football";
  "http://localhost:3000/api-football";

export async function getLiveFootball() {
  try {
    console.log("Fetching live matches");
    const response = await axios.get(`${baseUrl}/liveMatches`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching live football data:", error);
    throw error;
  }
}

export async function getFixturesByDate(date: string) {
  try {
    const response = await axios.get(`${baseUrl}/fixtureByDate/${date}`);
    console.log("Fixtures by date:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching fixtures by date:", error);
    throw error;
  }
}

export async function getTodaysGame() {
  try {
    const response = await axios.get(`${baseUrl}/todaysFixture`);
    console.log("Today's fixtures:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's fixtures:", error);
    throw error;
  }
}

export async function getMatchOdds(fixtureId: string) {
  try {
    console.log("Fetching odds for fixtureId:", fixtureId);
    const response = await axios.get(`${baseUrl}/fixtureOdds/${fixtureId}`);
    console.log("Fixture odds:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching match odds:", error);
    throw error;
  }
}

export async function getLeagues() {
  try {
    const response = await axios.get(`${baseUrl}/leagues`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    throw error;
  }
}

export async function getTopLeagueFixtures() {
  try {
    const response = await axios.get(`${baseUrl}/topLeagueFixtures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fixtures: ", error);
    throw error;
  }
}

export async function getTopLeagueMatchOdds(selectedFixtureId: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/topFixtureOdd/${selectedFixtureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting odd for game: ", error);
  }
}

export async function getOtherLeagueFixtures() {
  try {
    const response = await axios.get(`${baseUrl}/fixtureExeptTop`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fixtures: ", error);
    throw error;
  }
}

export async function getOtherLeagueMatchOdds(selectedFixtureId: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/fixtureOddExeptTop/${selectedFixtureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching odd for game: ", error);
    throw error;
  }
}

export async function getFixturesById(fixtureId: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/fetchFixtureById/${fixtureId}`
    );
    return response.data;
  } catch (error) {}
}
