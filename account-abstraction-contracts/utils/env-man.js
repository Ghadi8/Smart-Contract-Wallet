const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * Loads .env file
 *
 * @param {string} pathParent parent path to .env
 */
const envFilePath = pathParent => path.resolve(__dirname, `${pathParent}/.env.local`);

/**
 * read .env file & convert to array
 *
 * @param {string} efp envFilePath() return
 */
const readEnvVars = efp => fs.readFileSync(efp, "utf-8").split(os.EOL);

/**
 * Finds the key in .env files and returns the corresponding value
 *
 * @param {string} pathParent parent path to .env
 * @param {string} key Key to find
 * @returns {string|null} Value of the key
 */
const getEnvValue = (pathParent, key) => {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars(envFilePath(pathParent)).find((line) => line.split("=")[0] === key);
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
};

/**
 * Updates value for existing key or creates a new key=value line
 *
 * This function is a modified version of https://stackoverflow.com/a/65001580/3153583
 *
 * @param {string} pathParent parent path to .env
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
const setEnvValue = (pathParent, key, value) => {
  const envVars = readEnvVars(envFilePath(pathParent));
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}=${value}`);
  } else {
    // create new key value
    envVars.push(`${key}=${value}`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath(pathParent), envVars.join(os.EOL));
};

module.exports = {
    envFilePath,
    readEnvVars,
    getEnvValue,
    setEnvValue
}