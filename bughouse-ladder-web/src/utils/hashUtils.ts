/**
 * VB6 Bughouse Ladder - Types declarations
 */

/**
 * VB6 Line: 25 - Global constants from common.bas
 * Field indices used throughout the VB6 application
 */
export const CONSTANTS = {
  GROWS_MAX: 200,
  GCOLS: 44,
  GROUP_FIELD: 0,
  LAST_NAME_FIELD: 1,
  FIRST_NAME_FIELD: 2,
  RATING_FIELD: 3,
  RANKING_FIELD: 4,
  N_RATING_FIELD: 5,
  GRADE_FIELD: 6,
  GAMES_FIELD: 7,
  ATTENDANCE_FIELD: 8,
  PHONE_FIELD: 9,
  INFO_FIELD: 10,
  SCHOOL_FIELD: 11,
  ROOM_FIELD: 12,
  LAST_PARAM_FIELD: 12,
} as const;

/**
 * VB6 Line: 90 - Result string parsing symbols
 * Used for parsing game results from strings
 */
export const RESULT_STRING = "OLDWXYZ__________" as const;

export interface PlayerData {
  rank: number;
  group: string;
  lastName: string;
  firstName: string;
  rating: number;
  nRating: number;
  grade: string;
  games: number;
  attendance: number | string;
  info: string;
  phone: string;
  school: string;
  room: string;
}

export type PlayersArray = Record<number, PlayerData>;

export type GamesData = Record<string, number[]>;

/**
 * VB6 Line: 24 - Group codes for player classification
 */
export const GROUP_CODES = "A1xAxBxCxDxExFxGxHxIxZx   " as const;

/**
 * VB6 Line: 91 - Global players array for game entry parsing
 * Used by parse_entry function
 */
export let players = [0, 0, 0, 0, 0, 0];

export const gameScores = [0, 0, 0];
export const gameQuickEntry = 0;

/**
 * VB6 Line: 82-83 - Global playerOrRow for type tracking
 */
export let playerOrRow = true;

/**
 * VB6 Line: 84-88 - Sort options
 */
export const SORT_OPTIONS = {
  SORT_RANK: 0,
  SORT_NAME: 1,
  SORT_FIRST_NAME: 2,
  SORT_RATING: 3,
} as const;

export const sortOptions = SORT_OPTIONS;

/**
 * VB6 Line: 129-130 - Elo rating formula
 * Returns probability of winning for given ratings
 */
export function formula(myRating: number, opponentsRating: number): number {
  return 1 / (1 + 10 ** ((Math.abs(opponentsRating) - Math.abs(myRating)) / 400));
}

/**
 * VB6 Line: 133-137 - Get ladder name from current directory
 */
export function getLadderName(): string {
  const currentPath = window.location.pathname;
  const lastSlashIndex = currentPath.lastIndexOf('/');
  return currentPath.substring(lastSlashIndex + 1);
}

/**
 * VB6 Line: 138-154 - Player array to string conversion
 * Translates player and score arrays to hash string format
 */
export function entry2string(playersList: number[], scoreList: number[], quickEntryVal: number): string {
  // VB6 Line: 140-145 - Swap to ensure correct order
  if (playersList[0] > playersList[1]) {
    const temp = playersList[0];
    playersList[0] = playersList[1];
    playersList[1] = temp;
  }
  if (playersList[3] > playersList[4]) {
    const temp = playersList[3];
    playersList[3] = playersList[4];
    playersList[4] = temp;
  }

  const resultParts: string[] = [
    playersList[0].toString(),
    ':',
    playersList[1].toString(),
    RESULT_STRING.charAt(scoreList[0]),
  ];
  if (scoreList[1] > 0) {
    resultParts.push(RESULT_STRING.charAt(scoreList[1]));
  }
  resultParts.push(playersList[3].toString());
  resultParts.push(':');
  resultParts.push(playersList[4].toString());

  return resultParts.join('');
}

/**
 * VB6 Line: 155-271 - Parse entry string to structured data
 * Parses game entry like "23:29LW" into game details
 */
export function parseEntry(
  myText: string,
  playersList: number[],
  scoreList: number[],
  quickEntryVal: number
): number {
  // VB6 Line: 167-171 - Reset arrays
  playersList[0] = 0;
  playersList[1] = 0;
  playersList[2] = 0;
  playersList[3] = 0;
  playersList[4] = 0;
  playerOrRow = true;

  const strlen = myText.length;
  if (strlen < 2) return -3;

  const results: string[] = [];
  let entry = 0;
  let numOrChar = 1; // 0 = number, 1 = char
  let entryString = '';
  let errorNum = 0;
  let currentEntry = 0;

  for (let i = 1; i <= strlen; i++) {
    const mychar = myText.substring(i - 1, i);
    const myasc = mychar.charCodeAt(0);

    if (myasc > 33) {
      // VB6 Line: 180-183 - Handle underscore separator
      if (myasc === 95) {
        if (i === strlen) break;
        errorNum = 1;
        break;
      }

      // VB6 Line: 185-204 - Parse numbers and characters
      if (myasc >= 48 && myasc <= 57) {
        numOrChar = 0;
      } else {
        if (myasc === 58) {
          entry++;
          entryString = '';
          continue;
        } else if (mychar === 'W' || mychar === 'L' || mychar === 'D') {
          if (entry < 1) entry = 1;
          if (entry > 2) entry = 2;
        } else {
          errorNum = 2;
        }
        numOrChar = 1;
      }

      entryString += mychar;
      if (numOrChar === 0 && playersList.length > entry) {
        playersList[entry] = parseInt(entryString);
        if (playersList[entry] > CONSTANTS.GROWS_MAX) {
          errorNum = 9;
          break;
        }
      } else if (numOrChar === 1) {
        results[entry] = entryString;
        currentEntry = entry;
      }

      if (numOrChar !== 1) {
        entry++;
        entryString = '';
      }
    }
  }

  // VB6 Line: 223-228 - Process scores
  scoreList[0] = RESULT_STRING.indexOf(results[0]) - 1;
  scoreList[1] = results[1] ? RESULT_STRING.indexOf(results[1]) - 1 : 0;
  if (scoreList[0] < 0) scoreList[0] = 0;
  if (scoreList[1] < 0) scoreList[1] = 0;

  // VB6 Line: 229-245 - Normalize player order
  if (playersList[1] > 0) {
    if (playersList[0] > playersList[1]) {
      const temp = playersList[0];
      playersList[0] = playersList[1];
      playersList[1] = temp;
    }
    if (playersList[3] > playersList[4]) {
      const temp = playersList[3];
      playersList[3] = playersList[4];
      playersList[4] = temp;
    }
  }

  // VB6 Line: 236-241 - Swap sides if necessary
  if (playersList[0] > playersList[3]) {
    const temp = playersList[0];
    playersList[0] = playersList[3];
    playersList[3] = temp;
    const temp2 = playersList[1];
    playersList[1] = playersList[4];
    playersList[4] = temp2;
    scoreList[0] = 4 - scoreList[0];
    if (scoreList[1] > 0) scoreList[1] = 4 - scoreList[1];
  }

  // VB6 Line: 243-270 - Create hash value
  const res = playersList[4];
  const computedRes = (((((((res * 128) + playersList[3]) * 4) + scoreList[1]) * 4) + scoreList[0]) * 128 + playersList[1]) * 128 + playersList[0];

  // VB6 Line: 255-257 - Validate entry
  if (playersList[1] > 0 && playersList[4] === 0) {
    errorNum = 7;
  }

  // VB6 Line: 258-260 - Handle duplicates
  if (playersList[0] === playersList[3]) {
    return -4;
  }

  // VB6 Line: 262-270 - Return result
  if (errorNum !== 0 || playersList[0] === 0 || playersList[3] === 0 || scoreList[0] < 0 || scoreList[1] < 0) {
    return errorNum === 0 ? -3 : -errorNum;
  }
  return computedRes;
}

/**
 * VB6 Line: 156-128 - String to long conversion (wrapper for parseEntry)
 */
export function string2long(game: string, playersList: number[], scoreList: number[], quickEntryVal: number): number {
  return parseEntry(game, playersList, scoreList, quickEntryVal);
}

/**
 * VB6 Line: 107-125 - Long to string conversion
 * Converts hash value back to game string like "23:29LW"
 */
export function long2string(game: number): string {
  const resultParts: string[] = [];
  let tempGame = game;

  // VB6 Line: 111-121 - Extract structured data
  resultParts.push(tempGame % 128);
  tempGame = Math.floor(tempGame / 128);
  resultParts.push(':');
  resultParts.push(tempGame % 128);
  tempGame = Math.floor(tempGame / 128);
  resultParts.push(RESULT_STRING.charAt(tempGame % 4));
  tempGame = Math.floor(tempGame / 4);
  const nextChar = RESULT_STRING.charAt(tempGame % 4);
  if (nextChar !== 'O') {
    resultParts.push(nextChar);
  }
  tempGame = Math.floor(tempGame / 4);
  resultParts.push(tempGame % 128);
  tempGame = Math.floor(tempGame / 128);
  resultParts.push(':');
  resultParts.push(tempGame % 128);

  // VB6 Line: 122-124 - Clean up empty parts
  const finalResult = resultParts.join('').replace(/ /g, '').replace(':0', '');
  return finalResult;
}

/**
 * VB6 Line: 369-374 - Swap two integers
 */
export function swapint(a: number, b: number): number {
  const c = a;
  a = b;
  b = c;
  return a;
}

/**
 * VB6 Line: 375-380 - Reset placement tracking
 */
export function resetPlacement(): void {
  players = [0, 0, 0, 0, 0, 0];
}

/**
 * VB6 Line: 272-297 - Hash function initialization
 * Sets up pseudorandom array for hash generation
 */
export function hashInitialize(): void {
  const m_lHashTableSize = 2048;
  const rand8: number[] = Array.from({ length: 256 }, (_, i) => i);
  let k = 7;

  // VB6 Line: 286-293 - RC4-style key mixing
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 256; i++) {
      const s = rand8[i];
      k = (k + s) % 256;
      const temp = rand8[i];
      rand8[i] = rand8[k];
      rand8[k] = temp;
    }
  }

  hashArray = new Array(2048).fill('');
  hashIndex = new Array(2048).fill(0);
}

export let hashArray: string[] = [];
export let hashIndex: number[] = [];

/**
 * VB6 Line: 328-368 - Data hash function
 * Hash data using string-based XOR method
 */
export function dataHash(skey: string, sval: string, hashMethod: number): string {
  const b = new TextEncoder().encode(skey);
  let lKeyVal = b[0];
  const h1 = b[0] + 1;

  // VB6 Line: 339-343 - Build hash value from digits
  for (let i = 1; i < b.length; i++) {
    if (b[i] >= 48 && b[i] <= 57) {
      lKeyVal = lKeyVal * 10 + (b[i] - 48);
    }
  }

  let i = lKeyVal % 2048;
  let found = false;

  // VB6 Line: 344-362 - Collision resolution loop
  while (!found) {
    if (lKeyVal === hashIndex[i]) {
      // VB6 Line: 347-350 - Delete entry if requested
      if (hashMethod === 2) {
        hashIndex[i] = 0;
        hashArray[i] = '';
      }
      found = true;
    } else if (hashIndex[i] === 0) {
      // VB6 Line: 354-357 - Add new entry
      if (hashMethod === 0) {
        hashIndex[i] = lKeyVal;
        hashArray[i] = sval;
      }
      found = true;
    } else {
      i++;
      if (i === 2048) i = 0;
    }
  }

  return hashArray[i];
}