import React, { Component } from "react";
import "../custom.css";
import { Redirect } from "react-router-dom";
import { Users } from "./models/User";
import axios from "axios";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { backendUrlLogin } from "../BackendURL";
class Login extends Component {
  state = {
    successMessage: "",
    register: false,
    errorMessage: null,
    loginForm: {
      contactNo: "",
      password: ""
    },
    contactNo: "",
    contactErrorMessage: "",
    password: "",
    passwordErrorMessage: "",
    validPassWord: false,
    validContactNumber: false
  };

  login = event => {
    event.preventDefault();
    var contactNumber = document.getElementById("contactNumber").value;
    var password = document.getElementById("password").value;
    var user = new Users();
    user.contactNumber = contactNumber;
    user.password = password;
    axios
      .post(backendUrlLogin, user)
      .then(response => {
        this.setState({
          register: false,
          successMessage: "user logged in"
        });
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("userName", response.data.userName);
        window.location.reload();
      })
      .catch(err => {
        this.setState({
          successMessage: null,
          errorMessage: err
        });
      });
  };

  cancel = () => {
    var contactNumber = null;
    var password = null;
  };

  register = () => {
    this.setState({
      register: true
    });
    console.log(this.state.register);
  };

  validate = event => {
    var fieldName = event.target.name;
    var value = event.target.value;
    var errorMessage = "";
    switch (fieldName) {
      case "contactNo":
        errorMessage = "field required";
        if (value) {
          var regex = new RegExp(/^[6-9][0-9]{9}$/);
          console.log(regex.test(value));
          regex.test(value)
            ? (errorMessage = "")
            : (errorMessage += " Should be a valid indian number");
          if (errorMessage != "field required") {
            this.setState({ contactErrorMessage: errorMessage });
          } else {
            this.setState({
              contactErrorMessage: "",
              validContactNumber: true
            });
          }
         
        }
         this.setState({
            contactNo: value
          });
        break;
      case "password":
        errorMessage = "field required";
        if (value) {
          var regexCAp = new RegExp(/^.*[A-Z].*$/);
          var regexLow = new RegExp(/^.*[a-z].*$/);
          var regexNum = new RegExp(/^.*[0-9].*$/);
          regexCAp.test(value)
            ? (errorMessage = "")
            : (errorMessage =
                errorMessage + " Should contain atleast 1 upper case letter");
          regexLow.test(value)
            ? (errorMessage = "")
            : (errorMessage =
                errorMessage + " Should contain atleast 1 lower case letter ");
          regexNum.test(value)
            ? (errorMessage = "")
            : (errorMessage =
                errorMessage + " Should contain atleast 1 number");
          if (errorMessage != "field required") {
            this.setState({ passwordErrorMessage: errorMessage });
          } else {
            this.setState({
              passwordErrorMessage: "",
              validPassWord: true
            });
          }

         
        } this.setState({
            password: value
          });
        break;
    }
  };
  render() {
    if (this.state.register === true) return <Redirect to={"/register"} />;
    else if (this.state.successMessage != "") return <Redirect to={"/"} />;
    return (
      <div>
        <div className="row my-5">
          <section className="col"></section>
          <section className="col">
            <form className="form form-horizontal">
              <div className="form-group">
                <span className="p-float-label">
                  <InputText
                    id="contactNumber"
                    required
                    type="text"
                    min="6000000000"
                    max="9999999999"
                    name="contactNo"
                    onChange={this.validate}
                    className="form-control"
                    value={this.state.contactNo}
                  />
                  {
                    <label htmlFor="contactNo" className="font-weight-bold">
                      Contact Number
                    </label>
                  }
                </span>
                {this.state.contactErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.contactErrorMessage}
                  />
                ) : null}
              </div>
              <br />
              <div className="form-group">
                <span className="p-float-label">
                  <InputText
                    id="password"
                    value={this.state.loginForm.password}
                    required
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={this.validate}
                    value={this.state.password}
                  />
                  {
                    <label htmlFor="password" className="font-weight-bold">
                      Password
                    </label>
                  }
                </span>
                {this.state.passwordErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.passwordErrorMessage}
                  />
                ) : null}
              </div>
              <br />
              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-success form-control"
                      onClick={this.login}
                    >
                      Login
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="submit"
                      className="col btn btn-secondary form-control"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="my-4 col btn btn-primary form-control"
                  onClick={this.register}
                >
                  Register
                </button>
              </div>
            </form>
          </section>
          <section className="col"></section>
        </div>
      </div>
    );
  }
}

export default Login;
