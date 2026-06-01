import React from "react";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";
import router from "../../routes/routes";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const theme = extendTheme({
  fontFamily: {
    display: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

function App() {
  return (
    <CssBaseline>
      <CssVarsProvider theme={theme}>
        <ToastContainer />
        <RouterProvider router={router} />
      </CssVarsProvider>
    </CssBaseline>
  );
}

export default App;
