import { Route, Routes, useLocation } from "react-router";
import { Fragment } from "react";

import { privateRoutes, publicRoutes } from "./routes";
import { DefaultLayout, AdminLayout } from "./layouts";
import { routesConfig } from "./configs";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

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
                element={
                  <ProtectedAdminRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedAdminRoute>
                } />
            })
          ) : (
            publicRoutes.map((route, index) => { // client routes

              let Layout = DefaultLayout;
              const Page = route.component;

              if (route.layout === null) {
                Layout = Fragment;
              } else if (route.layout) {
                Layout = route.layout;
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