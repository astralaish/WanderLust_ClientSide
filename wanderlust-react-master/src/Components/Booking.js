import React, { Component } from "react";
import { Message } from "primereact/message";
import axios from "axios";
//import {Users} from './models/User';
import {backendUrlPackage} from '../BackendURL';
//import { Bookings } from "./models/Bookings";
import { backendUrlBooking} from "../BackendURL"
//import { backendUrlGetUser} from "../BackendURL";
//import { backendUrlGetDestination} from "../BackendURL";
import { Fieldset } from 'primereact/fieldset';
import { Link } from 'react-router-dom';

class BookDeal extends React.Component {

constructor(props){
    super(props);
    const parameter = props.match.params.parameter;
    //const destinationURL = backendUrlPackage+ parameter;
    this.state = {

        destination: {},

            formValue: {
                noOfPeople: "",
                checkIn: "",
                totalCost: "",
                booking: {},
                user: { "userId": sessionStorage.getItem("userId") },
                destination: { "destinationId": parameter }
            },
            formErrorMessages: {
                numberOfTravellers: "",
                tripStartDate: ""

            },
            formValid: {
                numberOfTravellers: false,
                tripStartDate: false,
                buttonActive: false
            },
            confirmationMessage: false,

        nooftravellers: 0,
        NooftravellersErrorMessage: "",
        startdate: "",
        endDate:"",
        startdateErrorMessage: "",
        validnooftravellers: false,
        validstartdate: false,
        successMessage: "",
        errMessage: "",
        destination:"",
        details:"",
        itinerary:"",
        restOfDays:"",
        packageInclusion:"",
        error:"",
        totalCost:0,
        flightCost:0,
        toggle:false

    }}



    handleToggle = (event) => {
        var flightCharges = this.state.destination.flightCharge
        var costPerPerson = this.state.destination.chargePerPerson
        var noOfPeople = this.state.nooftravellers
        var tc = costPerPerson*noOfPeople

        if(this.state.flightCost === 0){

        var tc = tc + (flightCharges*noOfPeople);

        this.setState({totalCost: tc, toggle:true,flightCost:flightCharges })
    }else{
        //tc = tc-(flightCharges*noOfPeople)
        this.setState({flightCost:0,totalCost:tc, toggle:false})
    }
    }

    setEndDate = (fieldname, value) => {
        if(fieldname==="startdate"){
            var newDate = new Date(value);
            newDate.setDate(newDate.getDate()+this.state.destination.noOfNights);
            this.setState({
                endDate : newDate
            })
        }else{
            this.state.startdate=""
        }
    }

    getTotalCost = (fieldname, value) => {

          if(fieldname==="nooftravellers"){
              this.setState({
                  totalCost : value*(this.state.destination.chargePerPerson)
                  
              })
              {console.log(this.state.totalCost)}
          }
    
}

    validate = (event) => {
        var fieldname = event.target.name;
        var value = event.target.value;
        var errorMessage = "";

        this.getTotalCost(fieldname,value);

        this.setEndDate(fieldname,value);

        switch (fieldname) {
            case "nooftravellers":
                {
                    errorMessage = "field required";
                    if (value) {
                        if (value > 5 || value < 1) {
                            errorMessage = "It should be minimum of 1 and maximum of 5";
                        }

                        if (errorMessage != "field required") {
                            this.setState({ nooftravellersErrorMessage: errorMessage });
                        }
                        else {
                            this.setState({
                                nooftravellersErrorMessage: "",
                                validnooftravellers: true
                            });
                        }

                    }
                    this.setState({ nooftravellers: value });

                    break;
                }
            case "startdate":
                {
                    errorMessage = "field required";

                    var todaydate = new Date();
                    todaydate.setHours(0, 0, 0, 0);

                    var userdate = new Date(value);
                    userdate.setHours(0, 0, 0, 0);

                    if (value) {
                        if (userdate <= todaydate) {
                            errorMessage = "trip start date should be a future date";
                        }

                        if (errorMessage != "field required") {
                            this.setState({ startdateErrorMessage: errorMessage });
                        }
                        else {
                            this.setState({
                                startdateErrorMessage: "",
                                validstartdate: true
                            });
                        }

                    }
                    this.setState({ startdate: value });

                    break;

                }
        }

    }

    componentDidMount()
    {
        axios.get(backendUrlPackage + "/" + this.props.match.params.destinationId)
        .then(res => {
            this.setState({
              destination : res.data,
              details : res.data.details,
              itinerary: res.data.details.itinerary,
              restOfDays: res.data.details.itinerary.restOfDays,
              packageInclusion: res.data.details.packageInclusion
            })
            console.log(res);
        })
          .catch(error => {
            if(error.res){
              this.setState({error: error.res.data.message})
            }
            else{
              this.setState({ errorMessage: "Server down"})
            }
          })
          console.log(this.state.destination)
        
    }

    // componentWillMount = () => {
    //     var user = new Users();
    //     user.userId = sessionStorage.getItem("userId");
    //     user.userName = sessionStorage.getItem("userName");
    //     var formValue = this.state.formValue

    //     this.setState({ formValue: { ...formValue, user: user } })

    // }

    showSuccessMessage =() => {
        this.setState({confirmationMessage: true})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.handleBooking();
        this.showSuccessMessage();
    }
    handleBooking = () => {
        var { formValue } = this.state
    console.table([formValue])
        this.setState({ errorMessage: "", successMessage: "" })
        //var formValue = this.state.formValue

        axios.post(backendUrlBooking, formValue)
            .then(response => {
                this.setState({ formValue: { ...formValue, booking: response.data } })
                this.setState({ confirmationMessage: true });
                console.log(formValue.booking);
            })
            .catch(error => {
                console.log(error)
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message })
                }
                else {
                    this.setState({ errorMessage: "server error" })
                }

            })
            console.table([formValue])
    }


    render()
    {
        const {destination,details,itinerary,packageInclusion,restOfDays} = this.state;
            var i;
        return (
            <div className="row">

                <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="container-fluid justify-content-center">
                    <h2>{destination.destinationName}</h2>
                    <Fieldset legend="Overview" toggleable={true} collapsed={true}>
                        <p>{details.about}</p>
                    </Fieldset>
                    <Fieldset legend="Package Inclusions"  toggleable={true} collapsed={true}>
                        <p><ul>{packageInclusion.split(",").map(x=> {
                  return <li>{x}</li>;
                })}</ul></p>
                    </Fieldset>
                    <Fieldset legend="Itinerary"  toggleable={true} collapsed={true}>
                    <h3>Day wise Itinerary</h3>
                    <h4>Day 1</h4>
                        <p>{itinerary.firstDay}</p>
                        <p>{restOfDays.split(",").map((x,n)=> {
                            return <div><h4>Day {i=++n+1}</h4> {x} </div>; })}</p>
                        <h4>Day {i+1}</h4>
                        <p>{itinerary.lastDay}</p>
                        <p style={{color: 'red'}}>**This itinerary is just a suggestion. Itinerary can be modified as per requirement. Contact us for more details.</p>
                    </Fieldset>
                </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card">
                <div className="card-body">        
                

                <div className="form-group">
                    <label htmlFor="nooftravellers">Number of Travellers</label>
                    <input type='number' name="nooftravellers" id="nooftravellers" min="1" onChange={this.validate} className="form-control"></input>
                    <span>{this.state.nooftravellersErrorMessage ? <Message severity="error" text="nooftravellers should be maximum of 5 and minimum of 1" /> : null}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="startdate">Trip start Date</label>
                    <input type='date' name="startdate" id="startdate" className="form-control" onChange={this.validate}
                    ></input>
                    <span>{this.state.startdateErrorMessage ? <Message severity="error" text="trip start date should be a future date" /> : null}</span>
                </div>

                <div className="custom-control custom-switch">
                   
                    <input name="checkbox" type="checkbox" id="customSwitches" class="custom-control-input" onClick={this.handleToggle}></input>
                    <label for="customSwitches" class="custom-control-label">Include Flight:</label>
                </div>

                

                <div className="form-group">
                    <span>{this.state.totalCost ? <Message severity="success" text={"You Pay Rs." + this.state.totalCost }/> : null}</span>
                </div>
                

                <div className="form-group">
                    <div className="row">
                        <div className="col">
                            <button
                                type="submit"
                                className="btn btn-success form-control"
                                onClick={this.handleSubmit}
                            >
                                Confirm booking
                            </button>
                        </div>
                        <div className="col">
                        <Link to="/"><button type="submit" className="btn-sm btn-primary">Go Back</button></Link>
                        </div>
                    </div>
                </div>
            <div>
            <span>{this.state.confirmationMessage ? <Message severity="success" text={"Your Booking is confirmed"}/> : null}</span>
            </div>
            </div>
            </div>
            </div>
            </div>
            );

    }
}
export default BookDeal;