import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import queryString from 'query-string';

const Waiting = (Component: any) => {
    return (props: any) => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
};

const RouteParams = (Component: React.FC<any>) => {
    return ({ match, location }: any) => <Component routeParams={match.params} queryParams={queryString.parse(location.search)} />;
};

const wrapModule = (module: any) => ({ default: module });

const Home = React.lazy(() => import('components/Home/Home.component').then((module) => wrapModule(module.Home)));

const TransactionView = React.lazy(() =>
    import('components/TransactionView/TransactionView.component').then((module) => wrapModule(module.TransactionView))
);
const BlocksListView = React.lazy(() =>
    import('components/BlocksListView/BlocksListView.component').then((module) => wrapModule(module.BlocksListView))
);
const BlockView = React.lazy(() =>
    import('components/BlockView/BlockView.component').then((module) => wrapModule(module.BlockView))
);
const AddressView = React.lazy(() =>
    import('components/AddressView/AddressView.component').then((module) => wrapModule(module.AddressView))
);
const RichListView = React.lazy(() =>
    import('components/RichListView/RichListView.component').then((module) => wrapModule(module.RichListView))
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
                    exact
                    path="/:coin(grlc|tux|tgrlc)/blocks"
                    component={RouteParams(Waiting(BlocksListView))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/blocks/:hash(\w{64,64})"
                    component={RouteParams(Waiting(BlockView))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/transactions/:txid(\w{64,64})"
                    component={RouteParams(Waiting(TransactionView))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/address/:address(\w+)"
                    component={RouteParams(Waiting(AddressView))}
                />
                <Route
                    path="/:coin(grlc|tux|tgrlc)/richlist"
                    component={RouteParams(Waiting(RichListView))}
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
