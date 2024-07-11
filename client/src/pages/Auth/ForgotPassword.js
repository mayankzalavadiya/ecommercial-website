

import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newpassword, setNewpassword] = useState("");
    // const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("/api/v1/auth/login", {
            email,
            newpassword,
        
          });
          if (res && res.data.success) {
            toast.success(res.data && res.data.message);
         
            navigate("/");
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };
    
  return (
    <Layout title={"Forgot Password - ecommerce app"}>
      <div className="form-container ">
      <form onSubmit={handleSubmit}>
        <h4 className="title">RESET PAAWORD</h4>
        
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Email "
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter Your Password"
            required
          />
        </div>
        {/* <div className="mb-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="enter your best cricketer"
            required
          />
        </div> */}

        
        <button type="submit" className="btn btn-primary">
          RESET
        </button>
        
      </form>
    </div>
    </Layout>
  )
}

export default ForgotPassword
