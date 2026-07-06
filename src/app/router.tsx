import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Layout } from "@/components/ui/layout";
import { SelectionPage } from "@/pages/selectionPage";
import { FillFlowPage } from "@/pages/fillFlowPage";
import { SummaryPage } from "@/pages/summaryPage";

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: "/", element: <SelectionPage /> },
      { path: "/fill-flow", element: <FillFlowPage /> },
      { path: "/summary", element: <SummaryPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
