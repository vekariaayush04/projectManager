import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import useUserStore from "./store";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";

function App() {
  const { user, isUserLoggedIn } = useUserStore();
  useEffect(() => {
    if (!user) {
      isUserLoggedIn();
    }
  }, [user]);

  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/login"} />}
          ></Route>
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
