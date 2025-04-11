import EPL from "@/assets/EPL.png";
import Bundesliga from "@/assets/Bundesliga.jpg";
import Eredivisie from "@/assets/Eredivisie.png";
import laliga from "@/assets/laliga.png";
import ligue1 from "@/assets/ligue1.png";
import seriA from "@/assets/seriA.jpg";
import { FootballLeague } from "@/types/football";

export const fetchedFootballLeagues: FootballLeague[] = [
  { id: 1, name: "English PL", logo: EPL },
  { id: 2, name: "La Liga", logo: laliga },
  { id: 3, name: "Serie A", logo: seriA },
  { id: 4, name: "Ligue 1", logo: ligue1 },
  { id: 5, name: "Bundesliga", logo: Bundesliga },
  { id: 6, name: "Eredivisie", logo: Eredivisie },
];
