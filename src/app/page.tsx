import LoginForm from "@/components/login/login_form";
import "@/styles/login.css"
import { useState } from "react";
import { Container } from "react-bootstrap";

const Home =  () => {

  return (

    <div className="div-login">
      <LoginForm 
      />
    </div>


  );
}

export default Home