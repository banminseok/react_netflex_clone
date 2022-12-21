import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CategoryType, getMovies, IGetMovesResult } from "../api";
import Slider from "../components/Slider";
import useWindowDimensions from "../useWidowDimensions";
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
  width: 40vw;
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
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;


function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMovesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const onOverlayClicked = () => {
    navigate(`/`);
  }
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);
  return <Wrapper>
    {isLoading ? (
      <Loader>Loading...</Loader>
    ) : (
      <>
        <Banner

          bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
        >
          <Title>{data?.results[0].title}</Title>
          <Overview>{data?.results[0].overview}</Overview>
        </Banner>
        <Slider sortMenu="movies" category={CategoryType.now_playing} />

        <AnimatePresence>
          {bigMovieMatch ? (
            <>
              <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }}></Overlay>
              <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={bigMovieMatch.params.movieId} >
                {clickedMovie && <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>}
              </BigMovie>
            </>
          ) : null}
        </AnimatePresence>
      </>
    )}
  </Wrapper>;
}

export default Home;

