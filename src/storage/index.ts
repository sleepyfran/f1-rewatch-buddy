/*
The storage of races is done in the local storage of the browser. Each season
occupies its own key in the local storage, with an array numbers where `null`
denotes that the race is pending, `-1` meaning that it was watched and any
other positive number being the timestamp of a session that the user is currently
watching.
 */

type SeasonData = (number | null)[];

const createSeasonKey = (season: number) => `season_${season}`;

const getDataOrDefaultOf = (season: number): SeasonData => {
  const seasonKey = createSeasonKey(season);
  return JSON.parse(localStorage.getItem(seasonKey) || "[]");
};

const saveData = (season: number, data: SeasonData) => {
  localStorage.setItem(createSeasonKey(season), JSON.stringify(data));
};

const ensureSeasonArrayLength = (arr: SeasonData, minLength: number) => {
  if (arr.length <= minLength) {
    arr.length = minLength + 1;
  }

  return arr;
};

const normalizeRound = (round: number) => round - 1;

const retrieveRound = (seasonData: SeasonData, round: number) => {
  const normalizedRound = normalizeRound(round);
  return seasonData.at(normalizedRound);
};

const setRound = (
  seasonData: SeasonData,
  round: number,
  value: number | null
) => {
  const normalizedRound = normalizeRound(round);
  ensureSeasonArrayLength(seasonData, normalizedRound);
  seasonData[normalizedRound] = value;
};

type RaceStatus =
  | { status: "pending" }
  | { status: "watched" }
  | { status: "watching"; timestamp: number };

export const retrieveRace = (season: number, round: number): RaceStatus => {
  const seasonData = getDataOrDefaultOf(season);
  const raceData = retrieveRound(seasonData, round);

  if (raceData === null || raceData === undefined) {
    return { status: "pending" };
  }

  if (raceData === -1) {
    return { status: "watched" };
  }

  return { status: "watching", timestamp: raceData };
};

export const setAsPending = (season: number, round: number) => {
  const seasonData = getDataOrDefaultOf(season);
  setRound(seasonData, round, null);
  saveData(season, seasonData);
};

export const setAsWatched = (season: number, round: number) => {
  const seasonData = getDataOrDefaultOf(season);
  setRound(seasonData, round, -1);
  saveData(season, seasonData);
};

export const setAsWatching = (
  season: number,
  round: number,
  timestamp: number
) => {
  const seasonData = getDataOrDefaultOf(season);

  if (timestamp < 0) {
    console.error(
      "Negative timestamps would be considered as watched, ignoring update of season/round",
      season,
      round
    );
    return;
  }

  setRound(seasonData, round, timestamp);
  saveData(season, seasonData);
};
