import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { DashboardAuthProvider } from "./context/dashboardAuthContext";
// import { SocketProvider } from "./context/SocketContext";
import { socketService } from "./sockets/connections";
import { SocketProvider } from "./context/SocketContext";
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

socketService.initSocket();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <SocketProvider>
        <DashboardAuthProvider>
          <RouterProvider router={router} />
        </DashboardAuthProvider>
      </SocketProvider>
    </StrictMode>
  );
}
