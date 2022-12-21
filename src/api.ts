//TheMovieDB API Key
//https://www.themoviedb.org/settings/api?language=ko

//TheMovieDB API Document
//https://developers.themoviedb.org/3/movies/get-now-playing
//https://api.themoviedb.org/3/movie/now_playing?api_key=c88c8ceeb5b10750061db2da23005f01
//&language=en-US&page=1&region=kr

const API_KEY = "c88c8ceeb5b10750061db2da23005f01";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMove {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  name?: string;
  vote_average: number;
  adult: boolean;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMove[];
  total_pages: number;
  total_results: number;
}

export enum CategoryType {
  "now_playing" = "now_playing",
  "latest" = "latest",
  "upcoming" = "upcoming",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "on_the_air" = "on_the_air",
  "airing_today" = "airing_today",
  "tv" = "tv",
  "movie" = "movie",
}

export async function getMovies(category: CategoryType) {
  return await fetch(
    `${BASE_PATH}/movie/${category}?api_key=${API_KEY}&page=1&region=kr`
  ).then((resp) => resp.json());
}
export async function getTvShow(tvCategory: CategoryType) {
  return await fetch(
    `${BASE_PATH}/tv/${tvCategory}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((resp) => resp.json());
}

export async function getMoviesByKeyword(keyword: string) {
  return await fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&region=kr`
  ).then((resp) => resp.json());
}

export async function getTvShowByKeyword(keyword: string) {
  return await fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1`
  ).then((resp) => resp.json());
}