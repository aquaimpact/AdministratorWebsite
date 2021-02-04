import React from "react";
import { BeatLoader } from "react-spinners";
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
	FormInput
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { Redirect } from 'react-router';

class Tables extends React.Component{

	constructor(){
		super();
		this.state = {
			schedules:[],
			openBVTM: false,
			openSchedule: false,
			versePreview:"",
			schedulePreview:"",
		}
		this.toggleBVTM = this.toggleBVTM.bind(this);
		this.toggleSchedule = this.toggleSchedule.bind(this);
		this.verseLinkChange = this.verseLinkChange.bind(this);
		this.scheduleLinkChange = this.scheduleLinkChange.bind(this);
	}

	toggleBVTM() {

		this.setState({
			openBVTM: !this.state.openBVTM,
			versePreview: ""
		});
	}

	toggleSchedule(){
		this.setState({
			openSchedule: !this.state.openSchedule
		});
	}

	populateImgs(){
		fetch('https://bpmcyouth.herokuapp.com/listAllSchedules').then(r => r.json()).then(data => this.setState({schedules: data})).catch(err => { console.log(err); });
	}

	onVerseError = () => {
	}

	onScheduleError = () => {
	}

	verseLinkChange(e){
		this.setState({versePreview: e.target.value})
	}

	scheduleLinkChange(e){
		this.setState({schedulePreview: e.target.value})
	}

	componentDidMount(){
		this.populateImgs();
	}

	componentDidUpdate(){
		// this.setState({schedules:r})
	}

	handleVerseSubmit = (event) => {
		
		let body = {
			scheduleUrl: this.state.versePreview,
			isSchedule: 0
		}

		fetch('https://bpmcyouth.herokuapp.com/updateSchedule', {
			method: 'POST',
			// We convert the React state to JSON and send it as the POST body
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		  }).then(response => {
			if (response.status >= 200 && response.status < 300) {

				this.setState({openBVTM:false})
				return <Redirect to='/' />;
			} else {
				alert('Somthing happened wrong');
			}
		});
	
		return <Redirect to='/' />;
	}

	handleScheduleSubmit = (event) => {
		
		let body = {
			scheduleUrl: this.state.schedulePreview,
			isSchedule: 1
		}

		fetch('https://bpmcyouth.herokuapp.com/updateSchedule', {
			method: 'POST',
			// We convert the React state to JSON and send it as the POST body
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		  }).then(response => {
			if (response.status >= 200 && response.status < 300) {

				this.setState({openSchedule:false})
				return <Redirect to='/' />;
			} else {
				alert('Somthing happened wrong');
			}
		});

		return <Redirect to='/' />;
	}

	render(){

		// console.log("YAY")

		let bibleVerse = this.state.schedules.filter(x => x.isSchedule == 0)[0] != undefined ? <img style={{float:'left', width: 700}} src={this.state.schedules.filter(x => x.isSchedule == 0)[0].scheduleUrl}/> : <BeatLoader/>;
		let schedule = this.state.schedules.filter(x => x.isSchedule == 1)[0] != undefined ? <img style={{float:'left', width: 700}} src={this.state.schedules.filter(x => x.isSchedule == 1)[0].scheduleUrl}/> : <BeatLoader/>;

		console.log("State Schedules:",this.state.schedules)
		console.log("Schedule:", schedule)
		
		// Modal
		const { openBVTM } = this.state;
		const { openSchedule } = this.state;

		return(
			<Container fluid className="main-content-container px-4">
				{/* Page Header */}
				<Row noGutters className="page-header py-4">
					<PageTitle sm="4" title="Schedules" subtitle="Schedule and Verse Of the Month" className="text-sm-left" />
				</Row>

				{/* Default Light Table */}
				<Row>
					<Col>
						<Card small className="mb-4">
						<CardHeader className="border-bottom">
							<h6 className="m-0">Bible Verse of the Month</h6>
						</CardHeader>
						<CardBody className="p-0 pb-3">
							<div style={{display: 'inline-block', alignContent:"center", width:"100%", height:"100%", margin:10, marginLeft:15}}>
								{bibleVerse}
								{/* <div className="clearfix"></div> */}
								<div style={{textAlign: 'center', verticalAlign: 'middle'}}>
									<Button theme="primary" size="lg" onClick={this.toggleBVTM}>
										Edit
									</Button>
								</div>
							</div>
						</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col>
						<Card small className="mb-4">
						<CardHeader className="border-bottom">
							<h6 className="m-0">This Month's Schedule</h6>
						</CardHeader>
						<CardBody className="p-0 pb-3">
							<div style={{display: 'inline-block', alignContent:"center", width:"100%", height:"100%", margin:10, marginLeft:15}}>
								{schedule}
								{/* <div className="clearfix"></div> */}
								<div style={{textAlign: 'center', verticalAlign: 'middle'}}>
									<Button theme="primary" size="lg" onClick={this.toggleSchedule}>
										Edit
									</Button>
								</div>
							</div>
						</CardBody>
						</Card>
					</Col>
				</Row>


				{/* Edit Bible Verse Of The Month */}
				<Modal size="lg" open={openBVTM} toggle={this.toggleBVTM}>
					<ModalHeader>Edit The Bible Verse of the Month</ModalHeader>
					<ModalBody>
						<Card small className="mb-3">
							<CardBody>
								<Form className="add-new-post" onSubmit={this.handleVerseSubmit}>
									<h6 className="m-0" style={{paddingBottom:10}}>Bible Verse Image Link</h6>
									<FormInput size="lg" className="mb-3" placeholder="Bible Verse Image Link" onChange={this.verseLinkChange}/>
									<h6 className="m-0" style={{paddingBottom:10}}>Image Preview</h6>
									<img src={this.state.versePreview} style={{width: 700, paddingBottom:10}} onError={this.onVerseError}/>
									<Button block type="submit" >Change</Button>
								</Form>
							</CardBody>
						</Card>
					</ModalBody>
				</Modal>

				{/* Edit This Month's Schedule */}
				<Modal size="lg" open={openSchedule} toggle={this.toggleSchedule}>
					<ModalHeader>Edit This Month's Schedule</ModalHeader>
					<ModalBody>
						<Card small className="mb-3">
							<CardBody>
								<Form className="add-new-post" onSubmit={this.handleScheduleSubmit}>
									<h6 className="m-0" style={{paddingBottom:10}}>This Month's Schedule Link</h6>
									<FormInput size="lg" className="mb-3" placeholder="This Month's Schedule Link" onChange={this.scheduleLinkChange}/>
									<h6 className="m-0" style={{paddingBottom:10}}>Image Preview</h6>
									<img src={this.state.schedulePreview} style={{width: 700, paddingBottom:10}} onError={this.onScheduleError}/>
									<Button block type="submit" >Change</Button>
								</Form>
							</CardBody>
						</Card>
					</ModalBody>
				</Modal>
			</Container>

		)
	}
}

export default Tables;
