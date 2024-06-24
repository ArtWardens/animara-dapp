import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import TestMain from "./pages/test/TestMain";

import { GlobalProvider } from "./context/ContextProvider";
import EditProfile from "./pages/EditProfile/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/test" element={<TestMain />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
