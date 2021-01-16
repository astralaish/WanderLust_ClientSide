import React, { Component } from "react";
import "../custom.css";
import {backendUrlPackage} from "../BackendURL";
import Axios from "axios";
import { Link,Redirect } from "react-router-dom";
import { Modal,Button } from 'antd';

class SearchPackage extends Component{

    constructor(){
        super()
        this.state={
            packages: [],
            errorMessage :"",
            successMessage:"",
            price: 6399,
            night: 22,
            priceChange: false,
            nightChange: false,
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
        this.fetchPackages();
    }

    fetchPackages = () =>{
        this.setState({errorMessage:"",successMessage:""})
        var packageURL= backendUrlPackage + "/" + this.props.match.params.continent;
        Axios.get(packageURL)
          .then(response => {this.setState({ packages: response.data })})
          .catch(error =>{
            if (error.response) this.setState({ errorMessage: error.response.data.message});
            else this.setState({ errorMessage: "Please Connect to the server"})
          })
      }

    onPriceChange=(event)=>{
        this.setState({price:event.target.value,priceChange:true})
    }
    onNightChange=(event)=>{
        this.setState({night:event.target.value,nightChange:true})
    }

    showModal = (x) =>{
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

    viewPackage=(x)=> 
    <div className="card"><br/>
    <div className="row">
        <div className="col-lg-4"> 
            <img src = {x.imageUrl} width="300" height="200" ></img></div>
        
        <div className="col-lg-5">  
        <span className="destination">{x.destinationName}</span>  
            <button className="btn btn-info btn-sm"><b>{x.noOfNights} Nights</b></button><br/>
            {(x.discount>0)?<p style={{color:'red'}} ><b>{x.discount}% Instant Discount</b></p>:""}

 
    </div>
    <div className="col-lg-3" align="center">
    
        <h5>Prices Starting From <h4 className="text-success">&#36;{(x.chargePerPerson)}</h4></h5>
      <div align="center">
      <br/>
      <button type="button" className="btn btn-info" onClick={()=>this.showModal(x)}>&nbsp;VIEW DETAILS</button>
      </div>
      <div align="center">
      <br/>
      
      <Link to="/booking"><Button type="button" className="btn btn-info" onClick={() => <Redirect to="/booking" />}>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BOOK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </Button></Link>
   
      </div>
      </div>
    
  </div><br/>
  </div>
            
    scroll=(x)=>
    (x.chargePerPerson<=this.state.price && x.noOfNights<=this.state.night)?this.viewPackage(x):""

    render(){
    if(this.state.value === true) return <Redirect to={"/"} />;
    return(
    <div>
        <br/>
        <div className="col-lg-9 offset-1">
        <div className="jumbotron">
        <form>
            <div className="row card-gray">
                          
                <div className="col-lg-3 offset-2">                            
                    <label >Price Range: &#36;{(this.state.price)}</label><br></br>
                    <input type="range" min="2049" max="6399" value={this.state.price} className="slider1"  onChange={this.onPriceChange}></input>
                </div>

                <div className="col-lg-3 offset-2">
                    <label>No of Nights: {(this.state.night)}</label><br></br>
                    <input type="range" min="7" max="22" value={this.state.night} className="slider1" onChange={this.onNightChange}></input>
                </div>
            </div>
        </form>
        </div>
        {
        (this.state.priceChange||this.state.nightChange)?
            this.state.packages.map(x=>this.scroll(x))
            :this.state.packages.map(x=>this.viewPackage(x))
        }

        {
            (this.state.errorMessage)?
            <h1 className="text-center">{this.state.errorMessage}</h1>:""
        }
        </div>
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
          )
      }
    

}
export default SearchPackage;
