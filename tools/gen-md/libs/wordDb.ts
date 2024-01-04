import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";
import { Collection } from "../deps.ts";

import { client } from "./client.ts";

export type Word = {
  _id: ObjectId;
  en: string;
  jp: string;
  note?: string;
  genres?: string[];
  examples?: Example[];
};

export type Example = {
  en: string;
  jp?: string;
};

export class WordDb {
  static coll: Collection<Word> = client.database("eng").collection("words");

  static async fetchGenres(): Promise<string[]> {
    return await this.coll.distinct("genres");
  }

  static async fetchWordsByGenre(genre: string): Promise<Word[]> {
    const words = await this.coll
      .find({ genres: { $in: [genre] } })
      .sort({ en: 1 })
      .toArray();
    words.sort((a, b) => a.en.localeCompare(b.en));
    return words;
  }

  // ジャンル設定されていない単語・フレーズをすべて取得
  static async fetchWordsWithoutGenre(): Promise<Word[]> {
    const words = await this.coll
      .find({ genres: { $exists: false } })
      .toArray();
    words.sort((a, b) => a.en.localeCompare(b.en));
    return words;
  }
}
