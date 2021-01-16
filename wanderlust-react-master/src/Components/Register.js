import React, { Component } from "react";
import "../custom.css";
import { Users } from "./models/User";
import axios from "axios";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { backendUrlRegister } from "../BackendURL";
import {Link} from "react-router-dom"

class Register extends Component {
  state = {
    successMessage: "",
    errorMessage: null,
    registerForm: {
      contactNumber: "",
      password: "",
      emailId: "",
      name: ""
    },
    formErrorMessage: {
      contactErrorMessage: "",
      emailIdErrorMessage: "",
      passwordErrorMessage: "",
      nameErrorMessage: ""
    },
    validField: {
      validPassWord: false,
      validContactNumber: false,
      validEmailId: false,
      validName: false,
      buttonactive: false
    }
  };

    register = event => {
    event.preventDefault();
    var contactNumber = document.getElementById("contactNumber").value;
    var password = document.getElementById("password").value;
    var emailId = document.getElementById("emailId").value;
    var name = document.getElementById("name").value;
    var user = new Users();
    user.contactNumber = contactNumber;
    user.password = password;
    user.emailId = emailId;
    user.userName = name;
    axios
      .post(backendUrlRegister, user)
      .then(response => {
        console.log(response.data)
        this.setState({
          successMessage: "Congratulations "+name+"! You have successfully been registered to WanderLust. Please Log in to utilies most of our fuctionality"
        });
      })
      .catch(err => {
        if(err.response) {
          this.setState({
            successMessage: null,
            errorMessage: err.response.data.message
          });
        } else {
          this.setState({
            errorMessage: "Please run the server"
          }); 
        }
      });
  };

  handleChange = event => {
    let fieldName = event.target.name;
    let value = event.target.value;
    let {registerForm}=this.state;
    this.setState({registerForm:{...registerForm,[fieldName]:value}})
    this.validate(fieldName,value)
  };

  validate = (name,value) => {
    let validField=this.state.validField
    let formErrorMessage=this.state.formErrorMessage

    switch(name) {
      case "name":
        var regex = new RegExp(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/);
        if(value===""){
          formErrorMessage.nameErrorMessage="Field Required"
          validField.validName=false
          break;
        }
        else if(regex.test(value) === false){
          formErrorMessage.nameErrorMessage="Name should only contain alphabets and space. Space should not be in the starting and ending."
          validField.validName=false
          break;
        }
        formErrorMessage.nameErrorMessage=""
        validField.validName=true
        break;
      case "emailId":
        var regex = new RegExp("[A-Za-z0-9]+[@][A-Za-z0-9]+.com");
        if(value===""){
          formErrorMessage.emailIdErrorMessage="Field Required"
          validField.validEmailId=false
          break;
        }
        else if(regex.test(value) == false){
          formErrorMessage.emailIdErrorMessage="Email Id Format : <Part1>@<Part2>.com"
          validField.validEmailId=false
          break;
        }
        formErrorMessage.emailIdErrorMessage=""
        validField.validEmailId=true
        break;
      case "contactNumber":
        var regex = new RegExp(/^[6-9][0-9]{9}$/);
        if(value===""){
          formErrorMessage.contactErrorMessage="Field Required"
          validField.validContactNumber=false
          break;
        }
        else if(regex.test(value) === false){
          formErrorMessage.contactErrorMessage="Contact number should start from 6,7,8,9(Indian Number) or it should be 10 digits"
          validField.validContactNumber=false
          break;
        }
        formErrorMessage.contactErrorMessage=""
        validField.validContactNumber=true
        break;
      case "password":
        var regex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{7,20}$/);
        if(value===""){
          formErrorMessage.passwordErrorMessage="Field Required"
          validField.validPassWord=false
          break;
        }
        else if(regex.test(value) === false){
          formErrorMessage.passwordErrorMessage="Password length should be 7 to 20(one uppercase, one lowercase, one number and one character at least)"
          validField.validPassWord=false
          break;
        }
        formErrorMessage.passwordErrorMessage=""
        validField.validPassWord=true
        break;
    }
    validField.buttonactive=validField.validName && validField.validPassWord && validField.validEmailId && validField.validContactNumber
    this.setState({formErrorMessage : formErrorMessage});
    this.setState({validField : validField});
  }

  render() {
    return (
      <div className="masthead1 register-page">
        <div className="row my-5">
          <section className="col"></section>
          <section className="col">
            <form className="form form-horizontal">
              <div className="form-group">
                <h1>Join Us</h1>
                <span className="p-float-label">
                  <InputText
                    id="name"
                    required
                    type="text"
                    name="name"
                    onChange={this.handleChange}
                    className="form-control"
                    value={this.state.registerForm.name}
                  />
                  {
                    <label htmlFor="name" className="font-weight-bold">
                      Name
                    </label>
                  }
                </span>
                {this.state.formErrorMessage.nameErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.formErrorMessage.nameErrorMessage}
                  />
                ) : null}
              </div>
              <br/>
              <div className="form-group">
                <span className="p-float-label">
                  <InputText
                    id="emailId"
                    required
                    type="text"
                    name="emailId"
                    onChange={this.handleChange}
                    className="form-control"
                    value={this.state.registerForm.emailId}
                  />
                  {
                    <label htmlFor="emailId" className="font-weight-bold">
                      Email Id
                    </label>
                  }
                </span>
                {this.state.formErrorMessage.emailIdErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.formErrorMessage.emailIdErrorMessage}
                  />
                ) : null}
              </div>
              <br/>
              <div className="form-group">
                <span className="p-float-label">
                  <InputText
                    id="contactNumber"
                    required
                    type="text"
                    min="6000000000"
                    max="9999999999"
                    name="contactNumber"
                    onChange={this.handleChange}
                    className="form-control"
                    value={this.state.registerForm.contactNumber}
                  />
                  {
                    <label htmlFor="contactNumber" className="font-weight-bold">
                      Contact Number
                    </label>
                  }
                </span>
                {this.state.formErrorMessage.contactErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.formErrorMessage.contactErrorMessage}
                  />
                ) : null}
              </div>
              <br />
              <div className="form-group">
                <span className="p-float-label">
                  <InputText
                    id="password"
                    required
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.registerForm.password}
                  />
                  {
                    <label htmlFor="password" className="font-weight-bold">
                      Password
                    </label>
                  }
                </span>
                {this.state.formErrorMessage.passwordErrorMessage ? (
                  <Message
                    severity="error"
                    text={this.state.formErrorMessage.passwordErrorMessage}
                  />
                ) : null}
              </div>
              <br />
              <div className="form-group">

                <button
                  type="submit"
                  className="my-4 col btn btn-primary form-control"
                  onClick={this.register}
                  disabled={!this.state.validField.buttonactive}
                >
                  Register
                </button>
                
              </div>
              {this.state.successMessage && <div className="text-success">
                  {this.state.successMessage}<br/> <Link to="/login">Click Here To Login</Link>
              </div>}
              {!this.state.successMessage && <div className="text-danger">
                  {this.state.errorMessage}
              </div>}
            </form>
          </section>
          <section className="col"></section>
        </div>
      </div>
    );
  }
}

export default Register;