import LoginForm from "@/components/login/login_form";
import "@/styles/login.css"
import { Suspense, useState } from "react";
import { Container } from "react-bootstrap";

const Home = () => {

  return (


      <div className="div-login">
        <LoginForm isPageLogin={true}/>
      </div>
   



  );
}

export default Home