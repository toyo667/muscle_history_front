import { V1ApiFactory } from "../openapi/api";
import axios from "axios";

export const api = () => {
  const api = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
  return V1ApiFactory(undefined, undefined, api);
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
