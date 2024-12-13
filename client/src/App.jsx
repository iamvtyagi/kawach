import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GenerateQR from './pages/GenerateQR.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Print from './pages/Print.jsx';

function App() {
  

    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-qr" 
            element={
              <ProtectedRoute>
                <GenerateQR />
              </ProtectedRoute>
            } 
          />
          <Route
          path="/print/:fileId"
          element={
              <Print/>
          }
          />
          <Route path="*" element={<Home/>} />
        </Route>
      ) 
    );

  return (
      <RouterProvider router={router} />
    );
}

export default App
