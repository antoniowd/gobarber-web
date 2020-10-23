import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/register" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/" component={Signin} />
    </Switch>
  );
};

export default Routes;
