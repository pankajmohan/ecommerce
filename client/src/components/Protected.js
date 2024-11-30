import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected(props) {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    let login = localStorage.getItem("Login");
    login = true;
    if (!login) {
      navigate("login");
    }
  });
  return (
    <div>
      <Component> </Component>
    </div>
  );
}

export default Protected;
