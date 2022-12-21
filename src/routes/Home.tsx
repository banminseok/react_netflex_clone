import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CategoryType, getMovies, IGetMoviesResult, IMove } from "../api";
import DetailMovie from "../components/DetailMovie";
import Slider from "../components/Slider";
import { makeImagePath } from "../utilities";

const Wrapper = styled.div`
  background:black;
`;
const Loader = styled.div`
  height:20vh;
  display:flex;
  justify-content:center;
  align-items:center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding:60px;
  background-image:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),url(${props => props.bgphoto});
  background-size:cover;
`
const Title = styled.h2`
  font-size:58px;
  margin-bottom:20px;
`
const Overview = styled.p`
  font-size:30px;
`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 70vh; 
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 50px;
  img {
    width: 25%;
    margin-right: 20px;
  }
`;


const CoverRight = styled.div`
  width: 80%;
  height: 77%;
  position: relative;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 35px;
  width: 300px;
`;
const BigOverview = styled.p`
  padding: 10px 50px;
  position: relative;
  top: -55px;
  height: 30%;
  overflow: auto;
  line-height: 23px;
  color: ${(props) => props.theme.white.lighter};
  word-spacing: 3px;
`;
const IconGroups = styled.div`
  width: 150px;
  height: 50px;
  position: absolute;
  bottom: 0;
  /* margin: 200px 0 0 10px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AgeInfo = styled.div<{ isadult: boolean }>`
  width: 42px;
  height: 42px;
  background-color: ${(props) => (props.isadult ? props.theme.red : "#019267")};
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  border-radius: 12px;
  line-height: 40px;
`;
const GradeScore = styled.div`
  display: flex;
  gap: 6px;
  width: 80px;
  height: 30px;
  border: solid 1px #fed049;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  color: #fed049;
`;


function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  // 현재 상영작 API
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies(CategoryType.now_playing)
  );
  const [clickedMovie, setClickedMovie] = useState<IMove>();
  // 클릭한 박스의 url에 id 값으로 데이터 필터링하기
  const bigMovieMatch = useMatch(`/movies/:movieId`);
  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  const onOverlayClicked = () => {
    navigate(`/`);
  }
  const selectMovie = (data: IMove) => {
    setClickedMovie(data);
  }
  return <Wrapper>
    {isLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}        >
          <Title>{data?.results[0].title}</Title>
          <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        <Slider sortMenu="movies" category={CategoryType.now_playing} selectMovie={selectMovie} />
        <Slider sortMenu="movies" category={CategoryType.upcoming} selectMovie={selectMovie} />
        <Slider sortMenu="movies" category={CategoryType.popular} selectMovie={selectMovie} />
        <Slider sortMenu="movies" category={CategoryType.top_rated} selectMovie={selectMovie} />

        <AnimatePresence>
          {bigMovieMatch ? (
            <DetailMovie scrollY={scrollY.get()} layoutId={bigMovieMatch.params.movieId + ""} clickedMovie={clickedMovie} />
          ) : null}
        </AnimatePresence>
      </>
    )}
  </Wrapper>;
}

export default Home;

