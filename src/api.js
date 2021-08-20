const LOCALE = "ru-RU";
const BASE_URL = "https://api.themoviedb.org/3";
const CONFIGURATION_PATH = "/configuration";
const GENRES_PATH = "/genre/movie/list";
const POPULAR_PATH = "/movie/popular";
const DISCOVER_PATH = "/discover/movie";
const SORT_TYPE = "popularity.desc";

const getApiUrl = (path, page = false, id = false) => {
  const url = new URL(`${BASE_URL}${path}`);

  url.searchParams.set("api_key", process.env.VUE_APP_API_KEY);
  if (id) {
    url.searchParams.set("sort_by", SORT_TYPE);

    url.searchParams.set("with_genres", id);
  }
  url.searchParams.set("language", LOCALE);

  if (page) {
    url.searchParams.set("page", page);
  }

  return url;
};

const getData = (path, onSuccess, onError, page = false, id = false) => {
  const url = getApiUrl(path, page, id);

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(onSuccess)
    .catch((err) => {
      console.log(err.message);
      onError();
    });
};

export {
  getData,
  CONFIGURATION_PATH,
  GENRES_PATH,
  POPULAR_PATH,
  DISCOVER_PATH,
};
