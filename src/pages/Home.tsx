import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { getUsers } from "../services/userAPI";
import {
  createStyles,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Theme,
  Toolbar,
} from "@material-ui/core";
import { Order, TableTitles, User } from "../services/general/model";
import { Search, Check, Clear } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: "100%",
      width: "100%",
      overflowX: "scroll",
    },
    table: {
      marginTop: theme.spacing(3),
      width: "max-content",
      minWidth: "100%",
    },
    searchInput: {
      marginTop: theme.spacing(3),
      width: "50%",
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(
  order: Order,
  orderBy: keyof T
): (
  a: { [key in keyof T]: T[key] },
  b: { [key in keyof T]: T[key] }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const Home = () => {
  const styles = useStyles();
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("id");
  useEffect(() => {
    if (token) {
      getUsers(token)
        .then((res) => {
          const sortedUsers: User[] = stableSort(
            res.data,
            getComparator<User>(order, orderBy)
          );
          setUsers(sortedUsers);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  useEffect(() => {
    const sortedUsers: User[] = stableSort(
      users,
      getComparator<User>(order, orderBy)
    );
    setUsers(sortedUsers);
  }, [order, orderBy]);

  const filteredUsers = () => {
    if (searchTerm === "") return users;
    else {
      return users.filter((user: User) =>
        user.username.toLowerCase().includes(searchTerm)
      );
    }
  };
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <TextField
          variant="outlined"
          label="Search Employees"
          id="input-with-icon-textfield"
          className={styles.searchInput}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
      <div className={styles.container}>
        <Table className={styles.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              {Object.entries(TableTitles).map(([title, label]) => (
                <TableCell
                  key={title}
                  sortDirection={orderBy === title ? order : false}
                >
                  {label}
                  <TableSortLabel
                    active={orderBy === title}
                    direction={orderBy === title ? order : "asc"}
                    onClick={handleRequestSort}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers().map((user) => (
              <TableRow key={user.id}>
                <TableCell  component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell >{user.username}</TableCell>
                <TableCell >{user.first_name}</TableCell>
                <TableCell >{user.last_name}</TableCell>
                <TableCell >
                  {user.is_active ? <Check /> : <Clear />}
                </TableCell>
                <TableCell align="center">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell >
                  {user.is_superuser ? <Check /> : <Clear />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
};
