import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";

const App = () => (
  <AuthProvider>
    <Routes />
  </AuthProvider>
);

export default App;
