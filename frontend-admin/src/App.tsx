import "./styles/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./page/layout.admin";
import NotFound from "./page/404";
import Dashboard from "./page/dashboard";
import Company from "./page/company";
import Job from "./page/job";
import User from "./page/user";
import Resume from "./page/resume";
import Role from "./page/role";
import Permission from "./page/permission";
function App() {
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "company",
          element: <Company />,
        },
        {
          path: "job",
          element: <Job />,
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "role",
          element: <Role />,
        },
        {
          path: "resume",
          element: <Resume />,
        },
        {
          path: "permission",
          element: <Permission />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
