import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GenerateQR from './pages/GenerateQR.jsx';

function App() {
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate-qr" element={<GenerateQR />} />
        </Route>
      )
    );

  return (
      <RouterProvider router={router} />
    );
}

export default App
