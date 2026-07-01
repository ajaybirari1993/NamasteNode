import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Feed from "../components/Feed";
import Connections from "../components/Connections";
import Request from "../components/Request";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/connections",
        element: <Connections />,
      },
      {
        path: "/request",
        element: <Request />,
      },
    ],
  },
]);

export default router;
