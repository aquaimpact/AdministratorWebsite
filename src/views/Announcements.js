import React from 'react'
import * as R from 'ramda'

import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import Calendar from 'tui-calendar'; /* ES6 */
import "tui-calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import moment from "moment"
import { 
	Container, 
	Row, 
	Col, 
	Card, 
	CardHeader, 
	CardBody, 
	Button , 
	Modal, 
	ModalBody, 
	ModalHeader,
	Form,
    FormInput,
    FormGroup
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { Redirect } from 'react-router';

class Announcements extends React.Component{

    constructor(props){

        super(props)

        this.state = {
            eventList:[],
            editOpen: false,
            deleteOpen: false,
            addItem:{},
            editItem:{},
            deleteItem:{},
            addOpen:false,
            
            //make a new modal class
            editName: "",
        }

        this.editToggle = this.editToggle.bind(this)
        this.deleteToggle = this.deleteToggle.bind(this)
        this.applyCallback = this.applyCallback.bind(this)
        this.applyCallbackADD = this.applyCallbackADD.bind(this)
        this.addToggle = this.addToggle.bind(this)

        // this.calendar = React.createRef();
    }

    populateEvents(){
        fetch('https://bpmcyouth.herokuapp.com/listAllEvents').then(r => r.json()).then(data => this.setState({eventList: data})).catch(err => { console.log(err); });
    }

    componentDidMount(){
        this.populateEvents();
    }

    addButtonClick = (e) => {
        this.setState({addOpen: !this.state.addOpen})
    }

    editButtonClick = (e) => {
        let id = e.currentTarget.parentNode.parentNode.getAttribute("data-rowid")
        console.log(id)
        this.setState({
            editOpen: !this.state.editOpen
        });

        if(id !== null){
            fetch(`https://bpmcyouth.herokuapp.com/getAnEvent?IDs=${id}`).then(r => r.json()).then(data => this.setState({editItem: data})).catch(err => { console.log(err); });
        }
    }

    deleteButtonClick = (e) => {
        let id = e.currentTarget.parentNode.parentNode.getAttribute("data-rowid")
        console.log(id)
        this.setState({
            deleteOpen: !this.state.deleteOpen
        });

        if(id !== null){
            fetch(`https://bpmcyouth.herokuapp.com/getAnEvent?IDs=${id}`).then(r => r.json()).then(data => this.setState({deleteItem: data})).catch(err => { console.log(err); });
        }
    }

    addToggle(){
        this.setState({
            addOpen: !this.state.addOpen
        });
    }

    editToggle(){
        this.setState({
            editOpen: !this.state.editOpen
        });
    }

    deleteToggle(){
        this.setState({
            deleteOpen: !this.state.deleteOpen
        });
    }

    addSendButtonClick = () =>{

        console.log(this.state.addItem)

        let item = {
            ...this.state.addItem, 
            "eventStartDatetime": this.convertJSDatetoTimestamp(this.state.addItem["eventStartDatetime"]),
            "eventEndDatetime": this.convertJSDatetoTimestamp(this.state.addItem["eventEndDatetime"])
        }

        fetch('https://bpmcyouth.herokuapp.com/createCalender', {
			method: 'POST',
			// We convert the React state to JSON and send it as the POST body
			body: JSON.stringify(item),
			headers: {
				'Content-Type': 'application/json'
			}
		  }).then(response => {
			if (response.status >= 200 && response.status < 300) {
				return <Redirect to='/' />;
			} else {
                console.log("Status Code:", response)
				alert('Somthing happened wrong');
			}
		});
        return <Redirect to='/' />;
    }

    editSendButtonClick = () =>{

        console.log("yayys")
        // var item = this.state.editItem

        //2020-11-25T17:59:45.928+00:00
        let item = {
            ...this.state.editItem, 
            "eventStartDatetime": this.convertJSDatetoTimestamp(this.state.editItem["eventStartDatetime"]),
            "eventEndDatetime": this.convertJSDatetoTimestamp(this.state.editItem["eventEndDatetime"])
        }

        console.log(item)

        fetch('https://bpmcyouth.herokuapp.com/updateCalender', {
			method: 'POST',
			// We convert the React state to JSON and send it as the POST body
			body: JSON.stringify(item),
			headers: {
				'Content-Type': 'application/json'
			}
		  }).then(response => {
			if (response.status >= 200 && response.status < 300) {
                
				return <Redirect to='/' />;
			} else {
                console.log("Status Code:", response)
				alert('Somthing happened wrong');
			}
		});
        return <Redirect to='/' />;
    }

    deleteSendButtonClick = () =>{

        // console.log(this.state.deleteItem["id"])

        fetch(`https://bpmcyouth.herokuapp.com/deleteCalender?IDs=${this.state.deleteItem["id"]}`)
        .then(
            response => {
                if (response.status >= 200 && response.status < 300) {
    
                    return <Redirect to='/' />;
                } else {
                    console.log("Status Code:", response)
                    alert('Somthing happened wrong');
                }
            }
        ).catch(err => { console.log(err); });
        return <Redirect to='/' />;
    }

    applyCallback(startDate, endDate){
        
        this.setState({
            editItem: {
                ...this.state.editItem,
                eventStartDatetime: startDate.format('DD/MM/yyyy HH:mm'),
                eventEndDatetime: endDate.format('DD/MM/yyyy HH:mm'),
            }
        })
    }

    applyCallbackADD(startDate, endDate){

        this.setState({
            addItem: {
                ...this.state.addItem,
                eventStartDatetime: startDate.format('DD/MM/yyyy HH:mm'),
                eventEndDatetime: endDate.format('DD/MM/yyyy HH:mm'),
            }
        })
    }

    setObjectByPath(fieldPath, value) {
        this.setState({
            editItem: R.set(R.lensPath(fieldPath), value, this.state.editItem)
        })
    }

    setObjectByPathADD(fieldPath, value) {
        this.setState({
            addItem: R.set(R.lensPath(fieldPath), value, this.state.addItem)
        })
    }

    onEventNameChange = (e) => {
        this.setObjectByPath(['eventName'], e.target.value)
        console.log(e.target.value)
    }

    onEventNameChangeADD = (e) => {
        this.setObjectByPathADD(['eventName'], e.target.value)
        console.log(e.target.value)
    }

    onEventDescriptionChange = (e) => {
        this.setObjectByPath(['eventDescription'], e.target.value)
    }

    onEventDescriptionChangeADD = (e) => {
        this.setObjectByPathADD(['eventDescription'], e.target.value)
    }

    convertSQLtoJSDate(date){

        if(date === undefined){
            return
        }

        console.log(date)

        var newDateTime = date.split(' ')
        var newDate = newDateTime[0]
        var newTime = newDateTime[1]

        console.log("newTime", newTime)

        newDate = newDate.split('/')
        newTime = newTime.split(':')

        return new Date(parseInt(newDate[2]), parseInt(newDate[1]) - 1, parseInt(newDate[0]), parseInt(newTime[0]), parseInt(newTime[1]))
    }

    convertJSDatetoTimestamp(date){
        //'DD/MM/yyyy HH:mm'

        if(date === undefined){
            return
        }

        let newdate = date.split(' ')[0].split('/')
        let newTime = date.split(' ')[1].split(':')

        let formattedDateTime = `${newdate[2]}-${newdate[1]}-${newdate[0]}T${newTime[0]}:${newTime[1]}:00.00+00:00`
        return formattedDateTime
    }

    render(){

        let eventItems
        // console.log("EditItem", this.state.editItem)

        if(this.state.eventList.length !== 0){
            eventItems = this.state.eventList.map(data => {
                return(
                    <tr data-rowid={data["id"]}>
                        <td>{data["id"]}</td>
                        <td>{data["eventName"]}</td>
                        <td>{data["eventStartDatetime"]}</td>
                        <td>{data["eventEndDatetime"]}</td>
                        <td>{data["eventDescription"]}</td>
                        <td><Button onClick={this.editButtonClick}><i class="material-icons">create</i> Edit</Button> <Button theme="danger" onClick={this.deleteButtonClick}><i class="material-icons">delete_outline</i> Delete</Button></td>
                    </tr>
                )
            })
        }

        console.log("addItem:", this.state.addItem)
        
        //
        let calStart = moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0))
        let calEnd = moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0,0))

        let ranges = {
            "Today Only": [moment(calStart), moment(calEnd)],
            "Yesterday Only": [moment(calStart).subtract(1, "days"), moment(calEnd).subtract(1, "days")],
            "3 Days": [moment(calStart).subtract(3, "days"), moment(calEnd)]
        }

        // let calStartEdit =new Date(this.state.editItem["eventStartDatetime"])
        // console.log(calStartEdit)
        return(

            <Container fluid className="main-content-container px-4">

                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Announcements" subtitle="Blog Posts" className="text-sm-left" />
                </Row>

                {/* MAIN TABLE */}
                <Row>
                    <Col>
                        <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0" style={{float:"left"}}>Current Events</h6>
                            <div style={{float:"right"}}>
                                <Button theme="success" onClick={this.addButtonClick}><i class="material-icons">add</i> Add</Button>
                            </div>
                            
                        </CardHeader>
                        <CardBody className="p-0 pb-3">
                            <table className="table mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th scope="col" className="border-0">
                                        #
                                    </th>
                                    <th scope="col" className="border-0">
                                        Event Name
                                    </th>
                                    <th scope="col" className="border-0">
                                        Event Start Date and Time
                                    </th>
                                    <th scope="col" className="border-0">
                                        Event End Date and Time
                                    </th>
                                    <th scope="col" className="border-0">
                                        Event Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventItems}
                            </tbody>
                            </table>
                        </CardBody>
                        </Card>
                    </Col>
                </Row>

                <div>
                    <Modal dialog size="lg" open={this.state.addOpen} toggle={this.addToggle}>
                        <ModalHeader>Add Calender Event</ModalHeader>
                        <ModalBody>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#username">Event Name</label>
                                {/* <input placeholder="Event Name" value={this.state.editItem["eventName"]} className="form-control"/> */}
                                <FormInput id="#username" placeholder="Event Name" value={this.state.addItem["eventName"]} onChange={this.onEventNameChangeADD}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#username">Event Date</label>
                                <FormInput placeholder="Event Name" value={`${this.state.addItem["eventStartDatetime"]} - ${this.state.addItem["eventEndDatetime"]}`} disabled/>
                                <br/>
                                <DateTimeRangeContainer
                                    ranges={ranges}
                                    start={moment(this.convertSQLtoJSDate(this.state.addItem["eventStartDatetime"]))}
                                    end={moment(this.convertSQLtoJSDate(this.state.addItem["eventEndDatetime"]))}
                                    local={{
                                        "format":"DD-MM-YYYY HH:mm",
                                        "sundayFirst" : false
                                    }}
                                    applyCallback={this.applyCallbackADD}
                                    standalone
                                    style={{
                                        fromDate: {backgroundColor: 'rgb(13,129,255)'},
                                        toDate: {backgroundColor: 'rgb(13,129,255)'},
                                        standaloneLayout: { display: "flex", maxWidth: "fit-content" }
                                    }}
                                />
                                <h8>* click apply to save the date & time</h8>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#password">Event Description</label>
                                <FormInput id="#password" placeholder="Event Description" value={this.state.editItem["eventDescription"]} onChange={this.onEventDescriptionChangeADD}/>
                            </FormGroup>
                            <Button style={{width:"100%", backgroundColor:"#17c671", borderColor:"#17c671"}} onClick={this.addSendButtonClick}> Save Changes </Button>
                        </Form>
                        </ModalBody>
                    </Modal>
                </div>

                {/* EDIT DIALOG */}
                <div>
                    <Modal dialog size="lg" open={this.state.editOpen} toggle={this.editToggle}>
                        <ModalHeader>Edit Calender Event</ModalHeader>
                        <ModalBody>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#username">Event Name</label>
                                {/* <input placeholder="Event Name" value={this.state.editItem["eventName"]} className="form-control"/> */}
                                <FormInput id="#username" placeholder="Event Name" value={this.state.editItem["eventName"]} onChange={this.onEventNameChange}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#username">Event Date</label>
                                <FormInput placeholder="Event Name" value={`${this.state.editItem["eventStartDatetime"]} - ${this.state.editItem["eventEndDatetime"]}`} disabled/>
                                <br/>
                                <DateTimeRangeContainer
                                    ranges={ranges}
                                    start={moment(Date.now())}
                                    end={moment(Date.now())}
                                    local={{
                                        "format":"DD-MM-YYYY HH:mm",
                                        "sundayFirst" : false
                                    }}
                                    applyCallback={this.applyCallback}
                                    standalone
                                    style={{
                                        fromDate: {backgroundColor: 'rgb(13,129,255)'},
                                        toDate: {backgroundColor: 'rgb(13,129,255)'},
                                        standaloneLayout: { display: "flex", maxWidth: "fit-content" }
                                    }}
                                />
                                <h8>* click apply to save the date & time</h8>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#password">Event Description</label>
                                <FormInput id="#password" placeholder="Event Description" value={this.state.editItem["eventDescription"]} onChange={this.onEventDescriptionChange}/>
                            </FormGroup>
                            <Button style={{width:"100%", backgroundColor:"#17c671", borderColor:"#17c671"}} onClick={this.editSendButtonClick}> Save Changes </Button>
                        </Form>
                        </ModalBody>
                    </Modal>
                </div>
                
                {/* DELETE DIALOG */}
                <div>
                    <Modal dialog size="lg" open={this.state.deleteOpen} toggle={this.deleteToggle}>
                        <ModalHeader>Permanently Delete - {this.state.deleteItem["eventName"]}</ModalHeader>
                        <ModalBody>
                            <h5>You are about to delete <b>{this.state.deleteItem["eventName"]}</b> with the following details:</h5>
                            <Form>
                                <FormGroup>
                                    <label htmlFor="#username">Event Name</label>
                                    <FormInput disabled value={this.state.deleteItem["eventName"]}/>
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="#username">Event Start Date</label>
                                    <FormInput disabled value={this.state.deleteItem["eventStartDatetime"]}/>
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="#username">Event End Date</label>
                                    <FormInput disabled value={this.state.deleteItem["eventEndDatetime"]}/>
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="#password">Event Description</label>
                                    <FormInput disabled value={this.state.deleteItem["eventDescription"]}/>
                                </FormGroup>
                                <Button style={{width:"100%", backgroundColor:"#e60b2f", borderColor:"#e60b2f"}} onClick={this.deleteSendButtonClick}> Delete Item </Button>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>

            </Container>

        )
    }
}

export default Announcements;