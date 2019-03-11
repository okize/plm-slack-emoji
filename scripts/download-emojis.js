#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// a json file copied from Slack that's a list of custom emojis
// created this file by watching network tab in dev tools while scrolling through emoji list
const CUSTOM_EMOJI_FILENAME = process.argv[2];

// a directory to store downloaded emoji images
const SAVED_EMOJI_DIRECTORY = path.normalize('./emoji');

if (!CUSTOM_EMOJI_FILENAME) {
  console.error('\nPlease provide path to emoji json list as first argument.');
  process.exit(1);
}

// abort if emoji file was not created (or filename could not be determined)
if (!fs.existsSync(CUSTOM_EMOJI_FILENAME)) {
  console.error(`\n${CUSTOM_EMOJI_FILENAME} file not found!`);
  process.exit(1);
}

// make emoji directory if it doesn't already exist
if (!fs.existsSync(SAVED_EMOJI_DIRECTORY)) {
  fs.mkdirSync(SAVED_EMOJI_DIRECTORY);
}

// load emoji json
const { emoji } = JSON.parse(fs.readFileSync(CUSTOM_EMOJI_FILENAME, 'utf-8'));

// download emoji images with curl
const download = async function (filename, url) {
  const command = `curl -o ${filename}  '${url}'`;
  return execSync(command);
};

// loop over emoji list and download them into local dir
emoji.forEach(async (emoji) => {
  const { name, url } = emoji;
  const ext = path.extname(url);
  const filename = `${name}${ext}`;
  const filepath = path.join(SAVED_EMOJI_DIRECTORY, filename);
  console.log(`downloading ${url} ...\n`);

  await download(filepath, url);
});

console.log(`\ndownloaded ${emoji.length} emojis`);
