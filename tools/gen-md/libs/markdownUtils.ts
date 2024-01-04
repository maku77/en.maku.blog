import { LongWithoutOverridesClass } from "https://deno.land/x/web_bson@v0.2.4/mod.ts";
import { ensureDir, join } from "../deps.ts";
import { Word } from "./wordDb.ts";

const MARKDOWN_DIR = "../../content/words/";
const MARKDOWN_TEMPLATE = `---
title: "<!-- TITLE -->"
draft: "<!-- DRAFT -->"
---

<!-- CONTENT -->
`;

export type WriteMarkdownParams = {
  basename: string;
  title: string;
  isDraft: boolean;
  content: string;
};

// 指定したディレクトリ内に指定したタイトルとコンテンツの Markdown ファイルを生成する関数
export async function writeMarkdown({
  basename,
  title,
  isDraft,
  content,
}: WriteMarkdownParams) {
  await ensureDir(MARKDOWN_DIR); // ディレクトリが存在しない場合は作成
  const filePath = join(MARKDOWN_DIR, `${basename}.md`);
  console.log(filePath);
  const markdown = MARKDOWN_TEMPLATE.replace("<!-- TITLE -->", title)
    .replace("<!-- DRAFT -->", isDraft ? "true" : "false")
    .replace("<!-- CONTENT -->", content);
  Deno.writeTextFileSync(filePath, markdown);
}

export function makeContent(words: Word[]) {
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
          content += `<br/>${example.jp}`;
        }
        content += "\n\n";
      }
    }
  }
  return content;
}
