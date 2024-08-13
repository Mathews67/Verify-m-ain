import { useState } from 'react';
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Verify from './components/Verify';
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function App() {
  const route = createBrowserRouter([
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/Verify",
      element: <Verify />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />, // Add route for Dashboard
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
