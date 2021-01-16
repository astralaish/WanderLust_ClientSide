import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backendUrlGetBooking } from "../BackendURL";
import { backendUrlDeleteBooking } from "../BackendURL";
import { Redirect } from "react-router-dom";
import { Dialog } from "primereact/dialog"
import { Snackbar } from "@material-ui/core/"
import { Alert } from "@material-ui/lab"

import "../custom.css";

class PlannedTrips extends Component {
    
    constructor(props) {
        super(props);
        var date = new Date();
        var date1 = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
       
        this.state = {
            visible: "",
            bookingId: "",
            checkIn: "",
            checkOut: "",
            noOfPeople: "",
            PlannedTrips: [],

            successMessage: "",
            errorMessage: "",
            cancelErrorMessage: "",
            refund: 0,
            url: backendUrlGetBooking + sessionStorage.getItem("userId"),
            url2: backendUrlDeleteBooking,
            showModel: false,
            alertOpenSuccess : false,
            alertOpenError : false,
            today : new Date(date1)

        }
      
    }
    onClick = (event) => {

        this.setState({ visible: event.target.value,
        showModel : true });
    }
    onHide = () => {
        this.setState({ visible: "",
        showModel: false });
    }

    componentDidMount = () => {
        axios.get(this.state.url)
            .then(response => {
                this.setState({ PlannedTrips: response.data })

            })
            .catch(error => {
                console.log(error)
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message,showModel : false })
                }
                else {
                    this.setState({ cancelErrorMessage: "Some error occurred ! Try again later! " ,alertOpenError : true ,showModel : false})
                }

            })

    }
    handleCancel = (event) => {
        this.setState({ visible: "", errorMessage: "" });
        var a = this.state.url2 + event.target.value
        console.log(a)
        axios.delete(a)
            .then(response => {
                this.setState({ showModel :false,alertOpenSuccess : true})
                this.componentDidMount()
            })
            .catch(error => {

                
                if (error.response) {
                    this.setState({ cancelErrorMessage : "Cancellation Failed!! " +  error.response.data.message ,alertOpenError : true,showModel : false})
                }
                else {
                    this.setState({ cancelErrorMessage: "Some error occurred ! Try again later!", alertOpenError : true,showModel : false })
                }
            })

    }

    render() {

        if (sessionStorage.getItem("userId") == null) {
            return <div className="row bg-reg">

                <div className=" mx-auto">
                    <div className="card-transparent  card-mod" >
                        <br/> <br/>
                        <div className="text-center">
                            <h4>

                                <span className="font-weight alert alert-info  ">Sorry you have to logIn to see your booking!</span>

                            </h4>
                        </div>
                        <br/> 
                        <div className="card-body">
                            <Link to="/login">
                                <button type="button" style={{ float: "left" }} className="btn btn-info" onClick={() => <Redirect to="/login" />}>Login</button>
                            </Link>
                            <button type="button" style={{ float: "right" }} className="btn btn-danger " onClick={() => window.history.back()}>Back</button>
                        </div>
                    </div>

                </div>
            </div>




        }

        return (
            <div className="image1">

                <React.Fragment>
                <Snackbar open={this.state.alertOpenSuccess} autoHideDuration={6000} 
            onClose={() => this.setState({ alertOpenSuccess : false}) }>
               <Alert severity="success">
                 Cancellation Successfull
               </Alert>
             </Snackbar>
             <Snackbar open={this.state.alertOpenError} autoHideDuration={6000} 
            onClose={() => this.setState({ alertOpenError : false}) }>
               <Alert severity="error">
                  {this.state.cancelErrorMessage}
               </Alert>
             </Snackbar>
                    {!this.state.errorMessage ?
                        <div>
                                <Dialog header="Cancellation" visible={this.state.showModel} model={true}
              contentStyle={{ maxHeight: "500px", overflow: "auto",height : "100" }}
              contentClassName="p-dialog p-dialog-title"
              onHide={this.onHide}
              anchorOrigin={{vertical: 'top', horizontal: 'center'}}
              blockScroll={true}
            >
                            <div>{this.state.PlannedTrips.map(x => {
                    

                                if (x.bookingId == this.state.visible) {

                                    return <div className="bg-modal3">
                                        <div className="modal-content3" >
                                            <div className="card">
                                                <div className="card-header">
                                    
                                                    <h4>Confirm Cancellation</h4>

                                                </div>
                                                <div className="card-body">
                                                    <div>Trip start date: {x.checkIn}</div>
                                                    <div> Trip end date: {x.checkOut}</div>
                                                    <div>Refund Amount: ${x.totalCost}</div>

                                                </div>
                                                <div className="card-footer">
                                                    <div className="row">
                                                        <button className="btn btn-danger btn-adj3" value={x.bookingId} onClick={this.handleCancel}>Confirm</button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    
                                        <button className="btn btn-info btn-adj2 " onClick={this.onHide}>Back</button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                }



                            })}</div>
                            </Dialog>

                            {/* <div id="modal" className="text-success text-center bgm">Cancellation Done Successfully</div> */}

                            <br /> <br /> <br />
                            <div> {this.state.PlannedTrips.map(x => {

                                return <div className="container" className="container-padding">
                                    <div className="row ">
                                        <div className="col-6 offset-3">

                                            <div className="card">
                                                <div className="card-header bg-custom text-light">
                                                    <h4 className="text-italic">Booking ID : {x.bookingId}</h4>
                                                </div>
                                                <div className="card-body cd">

                                                    <div className="row">
                                                        <div className="col-6">
                                                            <b>Trip starts on : </b>{x.checkIn}{}<br />
                                                            <b>Trip ends on : </b>{x.checkOut}<br />
                                                            <b>Travellers : </b>{x.noOfPeople}<br />

                                                        </div>
                                                        <div className="col-4 offset-1">
                                                            <b>Fare Details</b><br />
                                                            ${x.totalCost}<br/>                                               
                                                            <br/>
                                                            { 
                                                            this.state.today < new Date(x.checkIn) ? 
                                                            <button className="btn btn-link btn-adj5 btn-info text-light" value={x.bookingId} onClick={this.onClick}>Cancel Booking</button>
                                                            :null
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br /><br />
                                </div>
                            })}</div></div>
                        :
                        <div className="row bg-reg">

                <div className=" mx-auto">
                    <div className="card-transparent  card-mod" >
                        <br/> <br/>
                        <div className="text-center">
                            <h4>

                                <span className="font-weight alert alert-info  ">{this.state.errorMessage}</span>

                            </h4>
                        </div>
                        <br/> 
                        <div className="card-body">
                            <Link to="/packages">
                                <button type="button" style={{ float: "left" }} className="btn btn-info" onClick={() => <Redirect to="/packages" />}>Click here to Book</button>
                            </Link>
                          
                        </div>
                    </div>

                </div>
            </div>


}

                </React.Fragment>
            </div>

        )
    }
}

export default PlannedTrips;
