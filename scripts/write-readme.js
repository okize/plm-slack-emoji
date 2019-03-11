#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const EMOJI_DIR = 'emoji';

const emojis = fs.readdirSync(path.normalize(`./${EMOJI_DIR}`));

const markdownImage = (filename) => {
  const GITHUB_URL = `https://raw.githubusercontent.com/okize/plm-slack-emoji/master/${EMOJI_DIR}`;
  const name = path.parse(filename).name;

  return `![${name}](${GITHUB_URL}/${filename})`;
}

const githubEmojiUrls = emojis.map(markdownImage);

const readme = fs.createWriteStream('README.md');
readme.on('error', function (error) { console.error(error) });
readme.write(`
# plm-slack-emoji

Custom Slack emojis from team PLM

## Instructions

\`npm run download <PATH TO EMOJI JSON>\` - will download emojis from Slack given a json file with the following shape:

\`\`\`
{
  "emoji":[
    {
      "name": "emoji_name",
      "url": "https:\/\/emoji.gif",
    }
  ]
}
\`\`\`

\`npm run emojipack\` - generates an [emojipack](https://github.com/lambtron/emojipacks) yaml file which can be used to bulk upload emoji to another Slack account

\`npm run readme\` - generates this README

---

`);
githubEmojiUrls.forEach((url) => { readme.write(`${url}\n`); });
readme.end();
