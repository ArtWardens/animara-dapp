import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from "./components/AppLayout";

import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';
import TestMain from './pages/Clicker/TestMain';

import { GlobalProvider } from './context/ContextProvider';

function App() {
  return (
    <BrowserRouter>
    <GlobalProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/test" element={<TestMain/>}/>
        </Route>
      </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
