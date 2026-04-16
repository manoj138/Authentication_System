import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import { AuthProvider } from "./context/AuthContext";
import DefaultRoutes from "./routes/DefaultRoutes";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <DefaultRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
