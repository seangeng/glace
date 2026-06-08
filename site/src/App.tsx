import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Overview } from "./pages/Overview";
import { Toasts } from "./pages/Toasts";
import { Buttons } from "./pages/Buttons";
import { Panels } from "./pages/Panels";
import { Primitives } from "./pages/Primitives";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="toasts" element={<Toasts />} />
        <Route path="buttons" element={<Buttons />} />
        <Route path="panels" element={<Panels />} />
        <Route path="primitives" element={<Primitives />} />
      </Route>
    </Routes>
  );
}
