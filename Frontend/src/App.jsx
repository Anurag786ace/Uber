import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignup from './pages/CaptainSignup';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import { useContext } from 'react';
import { UserDataContext } from './context/UserContext';


const App = () =>{
  const user = useContext(UserDataContext)
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/captain-login' element={<CaptainLogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
        <Route path='/user-login' element={<UserLogin/>}/>
        <Route path='/user-signup' element={<UserSignup/>}/>
      </Routes>
    </div>
  )
}

export default App;
