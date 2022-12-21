import { AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useMatch } from "react-router-dom";
import styled from "styled-components";
import { CategoryType, getMoviesByKeyword, getTvShowByKeyword, IGetMoviesResult, IMove } from "../api";
import DetailMovie from "../components/DetailMovie";
import Slider from "../components/Slider";
const Wrapper = styled.div`
  padding: 50px;
  padding-top: 100px;
  height: 100vh;
`;
const SubTitle = styled.h1`
  font-size: 40px;
  margin: 20px 0;
`;
const SearchContainer = styled.div`
  width:100%;
  min-height:220px;
  padding-top : 120px;
`;
const EmptyResult = styled.div`
  font-size: 30px;
  font-weight: lighter;
  width: 100%;
  height: 50vh;
  text-align: center;
  padding: 25vh 0;
  color: rgba(255, 255, 255, 0.4);
`;

function Search() {
  const location = useLocation();
  const { scrollY } = useScroll();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movieData, isLoading: isMovieLoading } = useQuery<IGetMoviesResult>(
    ["search Moive", keyword],
    () => getMoviesByKeyword(String(keyword)),
  );
  const { data: tvData, isLoading: isTvLoading } = useQuery<IGetMoviesResult>(
    ["search TV", keyword],
    () => getTvShowByKeyword(String(keyword))
  );
  const [clickedMovie, setClickedMovie] = useState<IMove>();
  const bigMovieMatch = useMatch(`/search/:movieId`);
  const selectMovie = (data: IMove) => {
    setClickedMovie(data);
  }
  return (
    <Wrapper>
      <SubTitle>
        <span style={{ fontSize: "30px" }}>Search results for</span> "
        {keyword?.toLocaleLowerCase()}".
      </SubTitle>

      {!isMovieLoading &&
        !isTvLoading ? (
        <SearchContainer>
          <Slider sortMenu="searchTv" category={CategoryType.tv} keyword={keyword + ""} selectMovie={selectMovie} />
          <Slider sortMenu="searchMoive" category={CategoryType.movie} keyword={keyword + ""} selectMovie={selectMovie} />
          <AnimatePresence>
            {bigMovieMatch ? (
              <DetailMovie scrollY={scrollY.get()} layoutId={bigMovieMatch.params.movieId + ""} clickedMovie={clickedMovie} />
            ) : null}
          </AnimatePresence>
        </SearchContainer>
      ) : (
        <EmptyResult>Sorry! No result found :(</EmptyResult>
      )}
    </Wrapper>
  );
}

export default Search;