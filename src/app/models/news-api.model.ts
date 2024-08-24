/* eslint-disable @typescript-eslint/no-namespace */
interface ArticleBase {
  source: Source;
  author: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}

export interface OptionsBase {
  /**Use this to page through the results if the total results found is greater than the page size. */
  page: number;
  /**The number of results to return per page (request). 20 is the default, 100 is the maximum. */
  pageSize: number;

  /**Keywords or a phrase to search for. */
  q?: string;
  /**
   * A comma-seperated string of identifiers for the news sources or blogs you want headlines from. Use the /top-headlines/sources endpoint to locate these programmatically or look at the sources index. Note: you can't mix this param with the country or category params
   */
  sources?: string;
  /**
   * The category you want to get headlines for. Possible options: `business` `entertainment` `general` `health` `sciences` `ports` `technology`. Note: you can't mix this param with the sources param.
   */
  category?: string;

  from?: string;
  to?: string;
}

interface Source {
  id: string;
  name: string;
}
export interface ResponceBase<T> {
  status: string;
  totalResults: number;
  articles: T[];
}
export namespace NewsApi {
  export namespace HeadLines {
    export type Responce = ResponceBase<HeadLines.Article>;
    export interface Options extends OptionsBase {
      /**The 2-letter ISO 3166-1 code of the country you want to get headlines for. Possible options: `ae` `ar` `at` `au` `be` `bg` `br` `ca` `ch` `cn` `co` `cu` `cz` `de` `eg` `fr` `gb` `gr` `hk` `hu` `id` `ie` `il` `in` `it` `jp` `kr` `lt` `lv` `ma` `mx` `my` `ng` `nl` `no` `nz` `ph` `pl` `pt` `ro` `rs` `ru` `sa` `se` `sg` `si` `sk` `th` `tr` `tw` `ua` `us` `ve` `za`. Note: you can't mix this param with the `sources` param */
      country?: string;
    }

    export type Article = ArticleBase;
  }

  export namespace Everything {
    export type Responce = ResponceBase<Everything.Article>;

    export type Options = OptionsBase;

    export type Article = ArticleBase;
  }
}
