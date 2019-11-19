import { createStore, applyMiddleware, compose} from 'redux';
import {createLogger } from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();
const middleware       = [];
applyMiddleware(loggerMiddleware);

//For Redux Dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState) {
    return createStore(rootReducer, 
                       preloadedState,
                       composeEnhancers(applyMiddleware(...middleware, loggerMiddleware)));
}

//pull above configured store into index.js