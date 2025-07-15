import { Route, Routes } from "react-router";

import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";

function App() {
  return (
    <>
      <Routes>
        {publicRoutes.map((route, index) => {

          let Layout = DefaultLayout;
          const Page = route.component;

          if (route.layout) {
            Layout = route.layout;
          }

          return <Route
            key={index}
            path={route.path}
            element={<Layout><Page /></Layout>} />

        })}
      </Routes>
    </>
  );
}

export default App;