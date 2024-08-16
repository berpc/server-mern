import React from "react";
import { BrowserRouter } from "react-router-dom";
import { WebRouter, AdminRouter } from "./router";
import { AuthProvider, SiteProvider } from "./contexts";

export default function App() {
  return (
    <AuthProvider>
      {/* <SiteProvider> */}
      <BrowserRouter>
        {/* <WebRouter /> */}
        <AdminRouter />
      </BrowserRouter>
      {/* </SiteProvider> */}
    </AuthProvider>
  );
}