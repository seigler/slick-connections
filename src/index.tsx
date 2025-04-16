/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Route, Router } from "@solidjs/router";
import Dashboard from "./Dashboard";
import Puzzle from "./Puzzle";

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Dashboard} />
      <Route
        path="/puzzle/:id"
        component={Puzzle}
        matchFilters={{
          id: /^\d+$/,
        }}
      />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
