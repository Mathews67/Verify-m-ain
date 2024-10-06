import { useState } from 'react';
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Verify from './components/Verify';
import Dashboard from './components/Dashboard';
import CertificateGenerator from './components/CertificateGenerator';  // Import CertificateGenerator
import TranscriptGenerator from './components/TranscriptGenerator';    // Import TranscriptGenerator
import RegisterSchool from './components/RegisterSchool'; // Import RegisterSchool
import ManagePayments from './components/ManagePayments'; // Import ManagePayments component

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
      element: <Dashboard />, // Dashboard route
    },
    {
      path: "/dashboard/certificate", // Add route for CertificateGenerator
      element: <CertificateGenerator />,
    },
    {
      path: "/dashboard/transcript", // Add route for TranscriptGenerator
      element: <TranscriptGenerator />,
    },
    {
      path: "/dashboard/register-school", // Add route for RegisterSchool
      element: <RegisterSchool />,
    },
    {
      path: "/dashboard/manage-payments", // Add route for ManagePayments
      element: <ManagePayments />, 
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
