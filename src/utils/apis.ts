import axios, { AxiosInstance } from "axios";
import { Configuration } from "../openapi";

type FactoryFunction<T> = (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) => T;

/**
 * api実行オブジェクトを取得する。factoryはopenapiのもの
 */
export const api = <T>(
  factory: FactoryFunction<T>,
  config?: Configuration,
  basePath?: string
) => {
  const api = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
  return factory(config, basePath, api);
};

function getCookie(key: string) {
  var cookies = document.cookie.split(";");
  for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
    var cookie = cookies_1[_i];
    var cookiesArray = cookie.split("=");
    if (cookiesArray[0].trim() === key.trim()) {
      return cookiesArray[1]; // (key[0],value[1])
    }
  }
  return "";
}
