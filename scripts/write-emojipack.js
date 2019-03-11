#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const EMOJI_DIR = 'emoji';
const GITHUB_URL = `https://raw.githubusercontent.com/okize/plm-slack-emoji/master/${EMOJI_DIR}`;

const emojis = fs.readdirSync(path.normalize(`./${EMOJI_DIR}`));

const emojiList =  [];

emojis.forEach((filename) => {
  const name = path.parse(filename).name;

  emojiList.push({
    'name': name,
    'src': `${GITHUB_URL}/${filename}`,
  });
});

// write emojipack.yaml file
const readme = fs.createWriteStream('emojipack.yml');
readme.on('error', function (error) { console.error(error) });
readme.write(`title: plm-slack-emoji\nemojis:`);
emojiList.forEach((emoji) => {
  readme.write(`\n  - name: ${emoji.name}\n    src: >-\n      ${emoji.src}`);
});
readme.end();
