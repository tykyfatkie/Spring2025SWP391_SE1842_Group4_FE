import HomePage from "../src/app/pages/HomePage/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/app/pages/LoginPage/LoginPage";
import Header from "../src/app/components/Layout/Header";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;

