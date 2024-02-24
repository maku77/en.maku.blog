import { WordDb } from "./libs/wordDb.ts";
import { makeContent, writeMarkdown } from "./libs/markdownUtils.ts";

WordDb.fetchGenres().then((genres) => {
  for (const genre of genres) {
    console.log(`Genre: ${genre} ...`);
    WordDb.fetchWordsByGenre(genre)
      .then((words) =>
        writeMarkdown({
          basename: genre,
          title: `ジャンル別英単語集: ${makeGenreWithJp(genre)}`,
          linkTitle: `ジャンル別英単語集: ${makeGenreWithJp(genre)} (${
            words.length
          })`,
          isDraft: words.length < 5,
          content: makeContent(words),
        })
      )
      .catch((e) => console.error(e));
  }
});

WordDb.fetchWordsWithoutGenre()
  .then((words) =>
    writeMarkdown({
      basename: "misc",
      title: `ジャンル別英単語集: 【未分類】`,
      linkTitle: `ジャンル別英単語集: 【未分類】(${words.length})`,
      isDraft: true,
      content: makeContent(words),
    })
  )
  .catch((e) => console.error(e));

const GENRES_JP: Record<string, string> = {
  business: "ビジネス",
  economics: "経済",
  emotion: "感情",
  finance: "金融",
  math: "数学",
  medical: "医療",
  occupation: "職業",
  politics: "政治",
  science: "科学",
  work: "仕事",
};

function makeGenreWithJp(genreEn: string): string {
  // Search related japanese from GENRES_JP
  if (genreEn in GENRES_JP) {
    return `${GENRES_JP[genreEn]}（${genreEn}）`;
  }
  return genreEn;
}
