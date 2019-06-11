import React, { Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// import classes from "./App.module.scss"

const Waiting = (Component: any) => {
  return (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const RouteParams = (Component: React.FC<any>) => {
  return ({ match }: any) => <Component routeParams={match.params} />;
};

const wrapModule = (module: any) => ({ default: module });

const Home = React.lazy(() =>
  import("components/Home/Home.component").then((module) =>
    wrapModule(module.Home)
  )
);

export const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" component={Waiting(Home)} />
      <Route
        path="/:coin/blocks/:hash"
        component={RouteParams((props: any) => (
          <div>
            {props.routeParams.coin}/blocks/{props.routeParams.hash}
          </div>
        ))}
      />
    </Router>
  );
};
