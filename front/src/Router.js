import { BrowserRouter, Routes, Route } from "react-router-dom";
import Article from "./routes/Article";
import Finance from "./routes/Finance";
import Info from "./routes/Info";
import Stocks from "./routes/Stocks";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stocks />}></Route>
        <Route path="/:stockId/" element={<Info />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
