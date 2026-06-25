/*
 * SPDX-FileCopyrightText: 2024-2025 Pagefault Games
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/*
 * This script decrypts an encrypted pokerogue save file.
 * Usage: `pnpm decrypt-save <encrypted-file> [save-file]`
 */

import { saveKey as SAVE_KEY } from "#app/constants";
import { defaultCommanderHelpArgs } from "#script-utils/arguments";
import fs from "node:fs";
import { Command } from "@commander-js/extra-typings";
import cryptoJs from "crypto-js";

const { AES, enc } = cryptoJs;

const version = "1.0.0";

/**
 * A map of condensed keynames to their associated full names.
 */
// TODO: Move `src/system/game-data#systemShortKeys` to a new file and import it here
const systemShortKeys = {
  seenAttr: "$sa",
  caughtAttr: "$ca",
  natureAttr: "$na",
  seenCount: "$s",
  caughtCount: "$c",
  hatchedCount: "$hc",
  ivs: "$i",
  moveset: "$m",
  eggMoves: "$em",
  candyCount: "$x",
  friendship: "$f",
  abilityAttr: "$a",
  passiveAttr: "$pa",
  valueReduction: "$vr",
  classicWinCount: "$wc",
} as const;

/**
 * Replace the shortened key names with their full names.
 * @param dataStr - The string to convert
 * @returns The string with shortened keynames replaced with full names
 */
function convertSystemDataStr(dataStr: string): string {
  for (const [fullKey, abbreviated] of Object.entries(systemShortKeys)) {
    dataStr = dataStr.replace(new RegExp(`${abbreviated.replace("$", "\\$")}`, "g"), fullKey);
  }
  return dataStr;
}

function abbreviateSystemDataStr(dataStr: string): string {
  for (const [fullKey, abbreviated] of Object.entries(systemShortKeys)) {
    dataStr = dataStr.replace(new RegExp(`${fullKey.replace("$", "\\$")}`, "g"), abbreviated);
  }
  return dataStr;
}

/**
 * Decrypt a save file.
 * @param path - The path to the encrypted save file
 * @returns The decrypted save data, or `undefined` on error (with `process.exitCode` set).
 */
function decryptSave(path: string): string | undefined {
  let fileData: string;
  try {
    fileData = fs.readFileSync(path, "utf8");
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    switch (err.code) {
      case "ENOENT":
        console.error(`File not found: ${path}`);
        break;
      case "EACCES":
        console.error(`Could not open ${path}: Permission denied`);
        break;
      case "EISDIR":
        console.error(`Unable to read ${path} as it is a directory`);
        break;
      default:
        console.error(`Error reading file: ${err.message}`);
    }
    process.exitCode = 1;
    return;
  }
  return convertSystemDataStr(AES.decrypt(fileData, SAVE_KEY).toString(enc.Utf8)).toString();
}

function encryptSave(path: string): string | undefined {
  let fileData: string;
  try {
    fileData = fs.readFileSync(path, "utf8");
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    switch (err.code) {
      case "ENOENT":
        console.error(`File not found: ${path}`);
        break;
      case "EACCES":
        console.error(`Could not open ${path}: Permission denied`);
        break;
      case "EISDIR":
        console.error(`Unable to read ${path} as it is a directory`);
        break;
      default:
        console.error(`Error reading file: ${err.message}`);
    }
    process.exitCode = 1;
    return;
  }
  return AES.encrypt(abbreviateSystemDataStr(fileData), SAVE_KEY).toString();
}

/**
 * Write `data` to `filePath`, gracefully communicating errors that arise.
 * @param filePath - The path to write to
 * @param data - The data to write
 */
function writeToFile(filePath: string, data: string): void {
  try {
    fs.writeFileSync(filePath, data);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    switch (err.code) {
      case "EACCES":
        console.error(`Could not open ${filePath}: Permission denied`);
        break;
      case "EISDIR":
        console.error(`Unable to write to ${filePath} as it is a directory`);
        break;
      default:
        console.error(`Error writing file: ${err.message}`);
    }
    process.exitCode = 1;
  }
}

const program = new Command("pnpm decrypt-save")
  .description("Decrypt an encrypted pokerogue save file.")
  .helpOption("-h, --help", "Show this help message.")
  .version(version, "-v, --version", "Show the version number.")
  .option("-e, --encrypt", "Encrypt a save file instead of decrypting it.")
  .option("-f, --force", "Force overwrite of existing files.")
  .argument("<encrypted-file>", "Path to the encrypted save file to decrypt.")
  .argument("[save-file]", "Path to write the decrypted data. If omitted, prints to stdout.")
  .configureHelp(defaultCommanderHelpArgs)
  .showHelpAfterError(true)
  .parse();

const [encryptedFile, saveFile] = program.processedArgs;

if (!program.opts().force && saveFile !== undefined && fs.existsSync(saveFile)) {
  program.error(`Refusing to overwrite existing file: ${saveFile}`);
}

if (program.opts().encrypt) {
  console.log("Encrypting save file...");
  const encrypted = encryptSave(encryptedFile);
  if (!encrypted) {
    process.exit(process.exitCode ?? 1);
  }

  if (saveFile === undefined) {
    process.stdout.write(encrypted);
  } else {
    writeToFile(saveFile, encrypted);
  }
} else {
  const decrypted = decryptSave(encryptedFile);
  if (!decrypted) {
    process.exit(process.exitCode ?? 1);
  }

  if (saveFile === undefined) {
    process.stdout.write(decrypted);
  } else {
    writeToFile(saveFile, decrypted);
  }
}
