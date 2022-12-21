import { motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMove } from "../api";
import { makeImagePath } from "../utilities";


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

interface IMovieDetail {
  layoutId: string;
  clickedMovie?: IMove;
  scrollY: number;
}

function DetailMovie({ layoutId, clickedMovie, scrollY }: IMovieDetail) {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/search/:movieId`);
  const onOverlayClicked = () => {
    navigate(`/`);
  }
  return (
    <>
      <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }}></Overlay>
      <BigMovie style={{ top: scrollY + 100 }} layoutId={layoutId} >
        {clickedMovie && <>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                clickedMovie.backdrop_path,
                "w500"
              )})`,
            }}
          >
            <img src={makeImagePath(clickedMovie.poster_path, "w200")} alt={clickedMovie.title}></img>
            <CoverRight>
              <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
              <IconGroups>
                <GradeScore>
                  ❤
                  <div>{clickedMovie.vote_average * 0.5}</div>
                </GradeScore>
                <div>
                  {clickedMovie.adult ? (
                    <AgeInfo isadult={true}>19</AgeInfo>
                  ) : (
                    <AgeInfo isadult={false}>15</AgeInfo>
                  )}
                </div>
              </IconGroups>
            </CoverRight>
          </BigCover>
          <BigOverview>{clickedMovie.overview}</BigOverview>
        </>}
      </BigMovie>
    </>);

}


export default DetailMovie;