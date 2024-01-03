import { join } from "https://deno.land/std@0.210.0/path/join.ts";
import { ensureDir } from "./deps.ts";

import { Word, WordDb } from "./libs/wordDb.ts";

const MARKDOWN_DIR = "../../content/words/";
const MARKDOWN_TEMPLATE = `---
title: "ジャンル別英単語集「<!-- GENRE -->」"
---

<!-- CONTENT -->
`;

WordDb.fetchGenres().then((genres) => {
  for (const genre of genres) {
    console.log(`Genre: ${genre} ...`);
    WordDb.fetchWordsByGenre(genre)
      .then((words) => generateMarkdownFile(genre, words))
      .catch((err) => console.error(err));
  }
});

// 指定したディレクトリ内に指定したタイトルとコンテンツの Markdown ファイルを生成する関数
async function generateMarkdownFile(genre: string, words: Word[]) {
  await ensureDir(MARKDOWN_DIR); // ディレクトリが存在しない場合は作成
  const filePath = join(MARKDOWN_DIR, `${genre}.md`);
  const markdown = MARKDOWN_TEMPLATE.replace("<!-- GENRE -->", genre).replace(
    "<!-- CONTENT -->",
    makeContent(words)
  );
  Deno.writeTextFileSync(filePath, markdown);
}

function makeContent(words: Word[]) {
  let content = "";
  for (const word of words) {
    content += `{{< ex en="${word.en}" jp="${word.jp}"`;
    if (word.note) {
      content += ` note="${word.note}"`;
    }
    content += ">}}\n";

    // 例文があれば出力
    if (word.examples) {
      for (const example of word.examples) {
        content += `- ${example.en}`;
        if (example.jp) {
          content += ` / ${example.jp}`;
        }
        content += "\n\n";
      }
    }
  }
  return content;
}
