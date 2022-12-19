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
}
export interface IGetMovesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMove[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&region=kr`)
    .then(
      (response) => response.json()
    );
}
