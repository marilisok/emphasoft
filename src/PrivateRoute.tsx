import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import { PrivateRouteProps } from "./services/general/model";

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: RouteComponent,
  ...rest
}) => {

  const { token } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        token ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login/sign-in"} />
        )
      }
    />
  );
};
