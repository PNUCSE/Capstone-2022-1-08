import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { Query, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
const darkTheme = {
  bgColor: "whitesmoke",
  textColor: "#111",
  accentColor: "#9c88ff",
};
const lightTheme = {
  textColor: "#f5f6fa",
  backgroundColor: "#2f3640",
};
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
