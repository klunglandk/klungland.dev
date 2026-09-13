import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Layout from "../components/Layout/Layout";

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
