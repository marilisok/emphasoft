import React from "react";
import { AuthProvider } from "./Auth";
import { SignIn } from "./components/Login/SignIn";
import { PrivateRoute } from "./PrivateRoute";
import { Home } from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login/sign-in">
            <SignIn />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
