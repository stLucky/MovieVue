const LOCALE = "ru-RU";
const BASE_URL = "https://api.themoviedb.org/3";
const CONFIGURATION_PATH = "/configuration";
const GENRES_PATH = "/genre/movie/list";
const POPULAR_PATH = "/movie/popular";

const getApiUrl = (path) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", process.env.VUE_APP_API_KEY);
  url.searchParams.set("language", LOCALE);

  return url;
};

const getData = (path, onSuccess) => {
  const url = getApiUrl(path);

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(onSuccess);
};

export { getData, CONFIGURATION_PATH, GENRES_PATH, POPULAR_PATH };
