import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Layout from "../layout/Layout";
import Search from "../pages/search/Search";
import Settings from "../pages/search/Settings";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
