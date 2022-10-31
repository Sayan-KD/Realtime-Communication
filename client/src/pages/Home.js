import React, { Fragment } from "react";
import { Row, Button } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      email
      userName
    }
  }
`;
export default function Home(props) {
  const { loading, data, error } = useQuery(GET_USERS);
  if (data) console.log(data);
  if (error) console.log(error);
  const logout = () => {
    localStorage.setItem("token", ""); /*temporary*/
    localStorage.setItem("email", "");
    props.history.push("/");
  };
  return (
    <Fragment>
      <Row className="bg-white justify-content-around">
        <Button variant="link">
          <Link to="/login">Login</Link>
        </Button>

        <Button variant="link">
          <Link to="/register">Register</Link>
        </Button>

        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="container mt-3 text-center">
        <h1>{localStorage.getItem("email")}</h1>
      </Row>
    </Fragment>
  );
}
