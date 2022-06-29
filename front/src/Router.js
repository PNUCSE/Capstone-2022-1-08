import { BrowserRouter, Routes, Route } from "react-router-dom";
import Info from "./routes/Info";
import Stocks from "./routes/Stocks";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stocks />}></Route>
        <Route path="/info/:stockId/" element={<Info />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
