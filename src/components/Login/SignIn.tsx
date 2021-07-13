import React, { FormEvent, useContext, useState } from "react";
import {
  Button,
  Collapse,
  Container,
  createStyles,
  CssBaseline,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Loader } from "../UI/Loader";
import { Redirect } from "react-router";
import { AuthContext } from "../../Auth";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translate(-50%)",
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);
interface SignInState {
  [key: string]: { value: string; error: string | false };
}

export type RuleType = (v: string, state?: SignInState) => string | true;

export type RulesType = {
  [key: string]: RuleType[];
};

const rules: RulesType = {
  username: [
    (v) => !!v || "username is required",
    (v) => v.length <= 150 || "max length 150",
    (v) => /^[\w.@+-]+$/.test(v) || "invalid format",
  ],
  password: [(v) => !!v || "password is required"],
};

export const SignIn = () => {
  const { paper, form, submit, alert } = useStyles();
  const [state, setState] = useState<SignInState>({
    username: { value: "", error: false },
    password: { value: "", error: false },
  });
  const { login, loading, error, token } = useContext(AuthContext);

  const fieldValidation = (value: string, rules: RuleType[]): string | true => {
    for (const rule of rules) {
      const res = rule(value, state);
      if (res !== true) return res;
    }
    return true;
  };

  const formValidation = (): boolean => {
    let formValid = true;
    const newState: SignInState = Object.fromEntries(
      Object.entries(state).map(([name, { value }]) => {
        const res = fieldValidation(value, rules[name]);
        let error: string | false = false;
        if (res !== true) {
          error = res;
          formValid = false;
        }
        return [name, { value, error }];
      })
    );

    setState(newState);
    return formValid;
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (formValidation()) login(state.username.value, state.password.value);
  };

  const handleChange = (name: string, value: string): void => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: { value, error: false },
      };
    });
  };

  if (token) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className={alert}>
        <Collapse in={Boolean(error)}>
          <Alert severity="error">
            {"User with such username and password isn't exist"}
          </Alert>
        </Collapse>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={form} onSubmit={submitHandler}>
            <TextField
              fullWidth
              autoFocus
              variant="outlined"
              margin="normal"
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={state.username.value}
              error={!!state.username.error}
              helperText={state.username.error ? state.username.error : " "}
              onChange={(e) => handleChange("username", e.currentTarget.value)}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={state.password.value}
              error={!!state.password.error}
              helperText={state.password.error ? state.password.error : " "}
              onChange={(e) => handleChange("password", e.currentTarget.value)}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className={submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};
