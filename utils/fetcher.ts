// import { assertIsDefined } from '@/utils/assert';

export type FetchRequestError = {
  errObj: string;
  response: {
    status: number;
    error: string;
    exception: string;
  }
}

/**
 * Fetch API を用いてリソース通信を行う fetcher
 *
 * @param {string} url 
 * @param {string} [method='GET'] 
 * @param {{
 *  [key: string]: string
 * }} [headers={'Content-Type': 'application/json'}] 
 * @param {RequestInit} [init={mode: 'cors', method, headers}] 
 * @returns {Promise<U | null>}
 */
const fetcher = async <T, U>(
  url: string,
  method: string = 'GET',
  headers: {
    [key: string]: string;
  } = {
    'Content-Type': 'application/json',
  },
  init: RequestInit = {
    mode: 'cors',
    method,
    headers,
  }
): Promise<U | null | void> => {
  // API Base URL を取得
  // const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // env に定義されていなければ、ランタイムエラーを発生させる
  // assertIsDefined(apiBaseUrl);
  // Fetch API でリクエストを送信
  const result = await fetch(url, init)
    .then(async (res: Response) => {
      // OK 以外なら FetchRequestError Object を throw し .catch のエラーハンドリングに移行
      if (!res.ok) {
        throw {
          errObj: new Error(res.statusText),
          response: await res.json()
        }
      }

      return res.json()
    })
    .then((data: T) => responseToModelObject(data))
    .catch((err) => {
      // FetchRequestError を catch
      const fetchError = err as FetchRequestError
      // エラー処理 (エラーをログに出力したり、Sentry に通知する)
      console.error(fetchError.errObj);
      // 呼び出し元にエラーレスポンスをスローする
      throw fetchError;
    }) as Promise<U | null | void>;

  return result;
}

/**
 * レスポンスオブジェクトのキーをローワーキャメルに変換する
 *
 * @param {T} response 
 * @returns {U}
 */
export const responseToModelObject = <T, U>(response: T): U => {
  let result: U
  // 配列の場合は Array.prototype.map で Object を抽出して変換
  if (Array.isArray(response)) {
    result = response.map((obj => _convert(obj))) as U
  } else {
    result = _convert(response)
  }
  return result
}

/**
 * オブジェクトのキーをローワーキャメルに変換する
 *
 * @param {T} obj 
 * @returns {U}
 */
const _convert = <T, U>(obj: T): U => {
  return Object.keys(obj as Object).reduce((acc: any, key: string) => {
    // 値が object または配列の場合は再帰的に responseToModelObject を実行
    if(Object.prototype.toString.call((obj as any)[key]) === '[object Object]' || Array.isArray((obj as any)[key])) {
      acc[_toCamel(key)] = responseToModelObject((obj as any)[key]);
      return acc
    }
    acc[_toCamel(key)] = (obj as any)[key];
    return acc
  }, {}) as U;
}

/**
 * スネークケースからローワーキャメルへ変換する
 *
 * @param {string} str 
 * @returns {string}
 */
const _toCamel = (str: string): string => {
  return str.replace(/_(\w)/g, (_match, capture) => {
    return capture.toUpperCase();
  });
}

export default fetcher;