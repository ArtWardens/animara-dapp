import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from "./components/AppLayout";

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
