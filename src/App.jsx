import { Route, Routes } from "react-router";
import { useLocation } from "react-router";
import { Fragment } from "react";

import { privateRoutes, publicRoutes } from "./routes";
import { DefaultLayout, AdminLayout } from "./layouts";
import { routesConfig } from "./configs";

function App() {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(routesConfig.admin);

  return (
    <>
      <Routes>
        {
          isAdminRoute ? (
            privateRoutes.map((route, index) => { // admin routes

              let Layout = AdminLayout;
              const Page = route.component;

              if (route.layout) {
                Layout = route.layout;
              }

              return <Route
                key={index}
                path={route.path}
                element={<Layout><Page /></Layout>} />
            })
          ) : (
            publicRoutes.map((route, index) => { // client routes

              let Layout = DefaultLayout;
              const Page = route.component;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              };

              return <Route
                key={index}
                path={route.path}
                element={<Layout><Page /></Layout>} />
            })
          )
        }
      </Routes>
    </>
  );
}

export default App;