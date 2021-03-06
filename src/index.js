import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {IndexRedirect, Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import moment from 'moment';
import initialState from './initialState';
import configureStore from './configureStore';
import Main from './views/Main';
import {EditEntry} from './views/EditEntry';
import {BrowseEntries} from './views/BrowseEntries';
import actionCreator from './actionCreators';

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const AppActions = actionCreator(store.getState);

AppActions
    .subscribe((action) => {
        store.dispatch(action);
    });

ReactDOM.render(<Provider store={store}>
    <Router history={history}>
        <Route component={Main} path='/'>
            <IndexRedirect to={'/entries/' + moment().format('YYYY-MM-DD')} />
            <Route component={EditEntry} path='entries/:date' />
            <Route component={BrowseEntries} path='entries' />
        </Route>
    </Router>
</Provider>, document.getElementById('app'));
