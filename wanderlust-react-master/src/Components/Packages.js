import React, { Component } from "react";
import "../custom.css";
import Booking from "./Booking";
import {backendUrlPackages} from "../BackendURL";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Modal,Button } from 'antd';
import Axios from "axios";
import 'antd/dist/antd.css';

class Packages extends Component {

    constructor(props){
        super(props);
        this.state={
            packages: [],
            errorMessage: "",
            successMessage: "",
            price : "",
            packageInclusion : "",
            highlights : "",
            pace : "",
            imageUrl : "",
            showBook: false,
            loading : false,
            visible : false,
            value : false
        }
    }

    componentDidMount()
    {
        Axios
        .get(backendUrlPackages)
        .then(response => {
                this.setState({ packages: response.data });
              })
              .catch(error => {
                if (error.response) {
                  this.setState({ errorMessage: error.response.data.message });
                } else {
                  this.setState({ errorMessage: "Please Connect to the server" });
                }
              });
          
    };



   

    showModal = (x) => {
        this.setState(
            {visible: true, 
             price : x.chargePerPerson,
            packageInclusion : x.details.packageInclusion,
            highlights : x.details.highlights,
            pace : x.details.pace,
            imageUrl : x.imageUrl,
            },
        )
    }

    handleOk = () => {
        this.setState(
            {loading: true}
        )
        setTimeout( () => {
            this.setState(
                {loading:false,value:true}
            )
        }, 3000)
    }

    handleCancle = () => {
        this.setState(
            {visible: false}
        )
    }

    render() {
        const {showBook}=this.state;
        if(this.state.value === true) return <Redirect to={"/booking"} />;
        console.log(this.state.visible)
        return(
            <div>
                <div>
                    <br/>
                    <h2 className="text-center">PACKAGES</h2><br/>
                </div>
        {this.state.packages.map(x => {
        return(
                <div className="container-fluid">
                    <div className="card horizontal">
                        <div className="card-body row">
                            <div className="col-lg-4 col-lg-offset-1 col-sm-offset-2"> 
                                <img src = {x.imageUrl} width="300" height="200" ></img>
                            </div>
                            <div className="col-lg-7 col-lg-offset-1">
                                <h4 align="center">&nbsp;&nbsp;{x.destinationName}</h4><br/>
                                
                    {(x.discount>0)?
                    <p style={{color:'red'}} align="center" ><b>{x.discount}% Instant Discount</b></p>:""}
                                <p align="center">&nbsp;&nbsp; {x.details.about}
                                </p>
                                <div align="center"> 
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="button" className="btn btn-info" onClick={()=>this.showModal(x)}>
                                        CHECK ITINERARY 
                                    </Button>
                                    &nbsp;&nbsp;&nbsp; <Link to="/booking"><Button type="button" className="btn btn-info" onClick={() => <Redirect to="/booking" />}>Book</Button></Link>
                                </div>
                                 <div className="box-container">
                                    {showBook && <Booking/>}
                                </div>
                            </div>     
                        </div>
                    </div>
                </div>
                    );   
            })}
            <Modal
             visible={this.state.visible}
             title="Itinerary"
             onOk={this.handleOk}
             onCancel={this.handleCancle}
             width={1000}
             footer={[
                <Button key="back" onClick={this.handleCancle}>
                    Cancel
                </Button>,
                <Link to="/booking"><Button key="submit" type="primary" onClick={() => <Redirect to="/booking" />}>Book</Button></Link>
                    
             ]}
            >
                <div className="container-fluid">
                    <div className="card horizontal">
                        <div className="card-body row">
                            <div className="col-lg-6 col-lg-offset-1">
                                <h4 className="text-center">Tour Highlights</h4>
                               
                            {this.state.highlights.split(",").map(highlight => (
                                    <ul>
                                        <li>
                                            {highlight}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                            <div className="col-lg-6 col-lg-offset-1 col-sm-offset-2"> 
                                <br/><br/><br/>
                                <img src = {this.state.imageUrl} width="400" height="250" ></img>
                            </div>
                        </div>
                    </div>
                    <div className="card horizontal">
                        <div className="card-body row">
                            <div className="col-lg-6 col-lg-offset-1 col-sm-offset-2"> 
                                <br/><br/><br/>
                                <img src = "/assets/prague.jpg" width="400" height="250" ></img>
                            </div> 
                            <div className="col-lg-6 col-lg-offset-1">
                                <h4 className="text-center">Packages Inclusions</h4>
                                { this.state.packageInclusion.split(",").map(packageinclusion => (
                                    <ul>
                                        <li>
                                            {packageinclusion}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h5>Price Starting From: ${this.state.price}</h5><br/>
                    <h4>Tour Pace</h4>
                    {this.state.pace}
                </div>
            </Modal> 
            </div>

    
        );
    }
   

}
export default Packages;