// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./reducer/store.js";
// import "./index.css";
// import App from "./App.jsx";
// import { Toaster } from "react-hot-toast";
// import AppProvider from "./providers/AppProvider.js";

// createRoot(document.getElementById("root")).render(
//   <AppProvider>
//     <BrowserRouter>
//       <Provider store={store}>
//         <StrictMode>
//           <App />
//           <Toaster />
//         </StrictMode>
//       </Provider>
//     </BrowserRouter>
//     ,
//   </AppProvider>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./reducer/store.js";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import AppProvider from "./providers/AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppProvider>
          <App />
          <Toaster />
        </AppProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
