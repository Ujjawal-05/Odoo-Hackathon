import Navbar from './components/Navbar';
import FrontPage from "./pages/Front";
import Dashboard from "./pages/DashBoard";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
