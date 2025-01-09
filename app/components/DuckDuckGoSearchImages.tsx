"use client"

import fetcher from "@/utils/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

// 実際は別ファイルに分けたほうがいい (サンプルなんで一旦ここにｗ)
type DDGSearchResponse = {
  results: {
    width: number;
    height: number;
    image: string;
    source: string;
    thumbnail: string;
    title: string;
    url: string;
  }[];
}

type DDGSearch = DDGSearchResponse

export default function DuckDuckGoSearchImages() {
  // 検索を実行するか？ (初期レンダリング時は false)
  const [shouldSearch, setShouldSearch] = useState(false);

  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState("");
  const [inputSearchQuery, setInputSearchQuery] = useState("");

  // FastAPI 側の DuckDuckGo Search を購読
  const { data: searchResult, error: searchError, isLoading: isSearchLoading } = useSWR(
    // searchQuery -> inputSearchQuery で入力される度に検索を掛けれるが通信量が多くなるため非推奨
    shouldSearch ? `/api/v1/search_images?q=${searchQuery}` : null,
    fetcher<DDGSearchResponse, DDGSearch>
  );
  
  const handleSearchImagesBytDDG = () => {
    if (inputSearchQuery === "") return;
    setShouldSearch(true);
    setSearchQuery(inputSearchQuery);
  }

  useEffect(() => {
    if (!searchResult) return

    console.log(searchResult.results)
  }, [searchResult])

  return (
    <div className="w-full items-center flex flex-col gap-8">
      {/* 検索欄 */}
      <div className="z-10 w-full max-w-4xl items-center justify-around font-mono text-sm flex gap-x-4">
        <input
          type="text"
          value={inputSearchQuery}
          placeholder="DuckDuckGo で画像検索"
          onChange={(e) => setInputSearchQuery(e.target.value)}
          className="rounded-md px-4 py-2 text-white bg-gray-700 border border-gray-800 w-full"
        />
        <button
          type="button"
          onClick={handleSearchImagesBytDDG}
          className="rounded-md px-4 py-2 text-white bg-gray-800 border border-gray-900 w-40 disabled:opacity-50"
          disabled={inputSearchQuery === ""}
        >
          <code className="font-mono font-bold">検索</code>
        </button>
      </div>

      {/* 検索結果 */}
      <div className="flex flex-wrap justify-around gap-y-6">
        {isSearchLoading && <p>検索中...</p>}
        {/* 画像一覧 */}
        {searchResult?.results && searchResult.results.map(
          (result, index) =>
            <article
              key={`result-${index}`}
              className="w-48 h-48 rounded-full overflow-hidden"
            >
              {/* Next の Image は確か外部のホスト名を指定しないとダメだったはずだから img タグ使用 */}
              <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
            </article>
        )}
      </div>
    </div>
  );
}
