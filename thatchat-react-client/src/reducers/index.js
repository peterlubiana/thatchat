import { combineReducers } from 'redux'
import ClientEvents from './ClientEvents'
import AppEvents from './AppEvents'
import { connect } from 'react-redux';



export default combineReducers({
   ClientEvents,
   AppEvents
})