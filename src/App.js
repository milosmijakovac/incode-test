import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from '../src/components/Header'
import './App.css';
import UserData from './components/UserData';
import NextCustomer from './components/NextCustomer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={UserData} />
          <Route path="/next-customer" component={NextCustomer} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
