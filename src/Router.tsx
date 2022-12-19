import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Search from "./routes/Search";
import Tv from "./routes/Tv";



const BASE_URL = process.env.PUBLIC_URL;

const defaultRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "tv",
        element: <Tv />
      },
      {
        path: "search",
        element: <Search />
      },
    ],
    errorElement: <NotFound />
  }
], {
  basename: BASE_URL
});


export default defaultRouter;