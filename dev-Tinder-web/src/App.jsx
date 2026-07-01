import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";

import appStore from "./utils/appStore";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <Provider store={appStore}>
      <NavBar />
      <Outlet />
      <Footer />
    </Provider>
  );
}

export default App;
