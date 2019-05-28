import React, { Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// import classes from "./App.module.scss"

const Home = React.lazy(() =>
  import("components/Home/Home.component").then(module => ({
    default: module.Home
  }))
);

const Waiting = (Component: any) => {
  return (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" component={Waiting(Home)} />
    </Router>
  );
};
