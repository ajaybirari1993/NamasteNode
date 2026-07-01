import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Feed from "../components/Feed";

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
    ],
  },
]);

export default router;
