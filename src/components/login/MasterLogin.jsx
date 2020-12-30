import React from "react";
import { Login, Register } from "./index";
import "../login/MasterLogin.scss";
class MasterLogin extends React.Component {
  constructor(props) {
    super(props);
  }
  handleUserLogin=bool=>{
    this.props.loginUser(bool);
  }
  render() {
    const { isSigningIn } = this.props.propsofGD;
    const current = isSigningIn ? "Register" : "Login";
    const currentActive = isSigningIn ? "login" : "register";
    return (
      // <div className="App">
      //   <div className="login">
          <div className="container" ref={ref => (this.container = ref)}>
            {isSigningIn && (
              <Login  loginUser={()=>this.handleUserLogin(true)}/>
            )}
            {!isSigningIn && (
              <Register  loginUser={()=>this.handleUserLogin(true)}/>
            )}
          </div>
      //   </div>
      // </div>
    );
  }
}



export default MasterLogin;
