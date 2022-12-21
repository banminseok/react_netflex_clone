import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CategoryType, getMovies, getMoviesByKeyword, getTvShow, getTvShowByKeyword, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utilities";

const Loader = styled.div`
  height:20vh;
  display:flex;
  justify-content:center;
  align-items:center;
`;
const SliderContainer = styled.div`
position: relative;
top: -120px;
min-height:300px;
`;
const SliderTitle = styled.div`
font-size: 20px;
font-weight: 600;
padding: 0px 0px 15px 15px;
`;

const Button = styled.div<{ isRight: boolean }>`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 100px;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  display: flex;
  place-items: center;
  border-radius: 20px;
  background-color: rgba(100, 100, 100, 0.7);
  cursor: pointer;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0px 15px;
  
`;

const Box = styled(motion.div) <{ bgphoto: string }>`
  background-color: white;
  background-image:url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  position:relative;
  cursor:pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;


const rowVariants = {
  hidden: (back: boolean) => {
    return {
      x: back ? -window.innerWidth - 5 : (window.innerWidth + 5),
    }
  },
  visible: {
    x: 0,
  },
  exit: (back: boolean) => {
    return {
      x: back ? (window.innerWidth + 5) : (-window.innerWidth - 5),
    }
  },
};
const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    }
  }
}
const infoVariants = {
  hover: {
    opacity: 1,
  }
}
const offset = 6;

interface ISliderProps {
  category: CategoryType;
  sortMenu: string;
  keyword?: string;
  selectMovie: Function;
}

function Slider({ category, sortMenu, keyword, selectMovie }: ISliderProps) {
  const { data, isLoading, refetch } = useQuery<IGetMoviesResult>(
    [sortMenu, category],
    () => {
      return sortMenu === "movies" ? getMovies(category) :
        sortMenu === "tv" ? getTvShow(category) :
          sortMenu === "searchMoive" ? getMoviesByKeyword(String(keyword)) : getTvShowByKeyword(String(keyword))
    },
    {
      select: (data) => {
        const newData = {
          ...data,
          results: data?.results.filter(
            (tv) => tv.poster_path !== null && tv.backdrop_path !== null
          ),
        };
        return newData;
      },
    }
  );
  const sortMenu2 = (sortMenu === "searchMoive" || sortMenu === "searchTv") ? "search" : sortMenu;
  const navigate = useNavigate();
  const [back, setBack] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const { scrollY } = useScroll();
  // 클릭한 박스의 url에 id 값으로 데이터 필터링하기
  const bigMovieMatch = useMatch(`/${sortMenu2}/:movieId`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  const onBoxClicked = (movieId: number) => {
    navigate(`/${sortMenu2}/${movieId}`);
    selectMovie(data?.results.find((movie) => (movie.id) === movieId));
  }

  const prevIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  }
  const nextIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      //setIndex((prev) => ( prev === maxIndex ? 0 : prev + 1));
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
  useEffect(() => {
    refetch();
  }, [keyword]);
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SliderContainer>
          <SliderTitle>{category.toUpperCase().replace("_", " ")}</SliderTitle>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={back}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
              custom={back}
            >
              {
                data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "_" + category}
                      key={movie.id + "_" + category}
                      whileHover="hover"
                      initial="normal"
                      variants={BoxVariants}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants} >
                        <h4>{movie.title || movie.name}</h4>
                      </Info>
                    </Box>
                  ))}
            </Row>
          </AnimatePresence>
          <Button isRight={false} onClick={prevIndex}>
            <svg style={{ fill: "white" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" /></svg>
          </Button>
          <Button isRight={true} onClick={nextIndex}>
            <svg style={{ fill: "white" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" /></svg>
          </Button>
        </SliderContainer>
      )}
    </>
  );
}

export default Slider;
