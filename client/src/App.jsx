import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/SignUp.jsx';

function App() {
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
        </Route>
      )
    );

  return (
      <RouterProvider router={router} />
    );
}

export default App
