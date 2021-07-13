import { CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
  })
);

export const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};
