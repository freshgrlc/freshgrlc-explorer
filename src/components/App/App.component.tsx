import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

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

const Home = React.lazy(() => import('components/Home/Home.component').then((module) => wrapModule(module.Home)));

const TransactionView = React.lazy(() =>
    import('components/TransactionView/TransactionView.component').then((module) => wrapModule(module.TransactionView))
);

export const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Waiting(Home)} />
                <Route
                    path="/:coin1(grlc|tux|tgrlc)/home"
                    component={RouteParams(Waiting(Home))}
                />
                <Route
                    path="/:coin1(grlc|tux|tgrlc)\+:coin2(grlc|tux|tgrlc)/home"
                    component={RouteParams(Waiting(Home))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/blocks/:hash(\w{64,64})"
                    component={RouteParams((props: any) => (
                        <div>
                            {props.routeParams.coin}/blocks/
                            {props.routeParams.hash}
                        </div>
                    ))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/transactions/:txid(\w{64,64})"
                    component={RouteParams(Waiting(TransactionView))}
                />
                <Route
                    component={() => (
                        <div>
                            <h1>Error 404</h1>
                            <Link to="/">Back to Safety</Link>
                        </div>
                    )}
                />
            </Switch>
        </Router>
    );
};
