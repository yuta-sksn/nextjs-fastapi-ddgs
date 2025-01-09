from fastapi import FastAPI
from duckduckgo_search import DDGS

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.get("/api/v1/search_images")
def search_images(q: str = "", max_results: int = 20):
    # 検索クエリが空文字の場合, 空の配列を返却
    if q == "":
        return { "results": [] }

    # DuckDuckGo で画像検索を行い, 結果を格納
    results = DDGS().images(q, "ja-jp", max_results = max_results)

    return { "results": results }