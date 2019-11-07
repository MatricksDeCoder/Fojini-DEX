import {get, groupBy, reject, maxBy, minBy} from 'lodash';
import { createSelector } from 'reselect';
//import moment from 'moment';
//import { ETHER_ADDRESS, GREEN, RED, ether, tokens } from '../helpers';

console.log(groupBy, minBy, reject, maxBy);

const account               = state => get(state, 'web3.account'); //vs state.web3.account
export const accountSelector= createSelector(account, acc => acc); //any formating first

const web3                  = state => get(state, 'web3.connection');
export const web3Selector   = createSelector(web3, w => w); //any formating first

const tokenLoaded           = state => get(state, 'token.loaded',true);
const exchangeLoaded        = state => get(state, 'exchange.loaded', true); //pass default values 
export const contractsLoadedSelector  = createSelector(tokenLoaded,  
    exchangeLoaded,
    (tl,el) => (tl && el)
);

const exchangeContract                = state => get(state, 'exchange.contract');
export const exchangeContractSelector = createSelector(exchangeContract, ex => ex); //any formating first

const tokenContract                   = state => get(state, 'token.contract');
export const tokenContractSelector    = createSelector(tokenContract, t => t); //any formating first


