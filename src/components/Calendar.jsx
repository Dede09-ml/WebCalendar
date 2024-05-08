import React from "react";
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Calendar.css'

function Calendar() {

    const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let time = new Date() //hari ini
    let date = time.getDate()
    let month = time.getMonth()
    let year = time.getFullYear()
    var lastDay = new Date(time.getFullYear(), time.getMonth() + 1, 0); //hari terakhir di bulan ini

    let dateArr = []
    for (let i = 1; i <= lastDay.getDate(); i++) {
        dateArr.push(i)
    }

    // console.log(dateArr)

    //get date before this month
    time = new Date(`${monthArr[month]} 1, ${year}`) //tanggal 1 hari ini
    let firstDay = time.getDay()
    let datesBefore = []
    for (let j = 0; j < firstDay; j++) {
        time.setDate(time.getDate() - 1)
        datesBefore.unshift(time.getDate())
    }

    //get date after this month
    let datesAfter = []
    let getLast = lastDay.getDay()
    for (let k = 0; k < (6 - getLast); k++) {
        lastDay.setDate(lastDay.getDate() + 1)
        datesAfter.push(lastDay.getDate())
    }


    const [show, setShow] = useState(false);
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")
    const [clock, setClock] = useState("")
    const [email, setEmail] = useState("")
    const [mode, setMode] = useState("")


    const [data, setData] = useState([])

    // const getData = () => {
        
    // }

    
    useEffect(() => {
        let allItem = []
        try {
            for (let i = 0; i < dateArr.length; i++) {
                allItem.push(JSON.parse(localStorage.getItem(dateArr[i])))
            }
    
            setData(allItem)
        } catch (error) {
            console.log(error.message)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setMode("create")
        setNumber(e)
        setName("")
        setClock("")
        setEmail("")
        if(e<date){
            alert("tidak bisa menambahkan sebelum hari ini")
        } else if (JSON.parse(localStorage.getItem(e)) == null) {
            setShow(true);
        } else if (JSON.parse(localStorage.getItem(e)).length >= 3) {
            alert("Anda tidak bisa menambahkan event, 3 event sudah ditambahkan")
        } else {
            setShow(true)
        }

        

    }
    const saveHandler = () => {
        if (localStorage.getItem(number) == null) {
            let content = []
            let item = {
                name: name,
                time: clock,
                invitees: email
            }
            content.push(item)
            localStorage.setItem(number, JSON.stringify(content))
        } else {

            let content = JSON.parse(localStorage.getItem(number))
            let item = {
                name: name,
                time: clock,
                invitees: email
            }
            content.push(item)


            localStorage.setItem(number, JSON.stringify(content))
        }
        setShow(false)

    }

    const saveEditHandler = () => {
        setShow(false)
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    const handleTimeChange = (e) => {
        setClock(e.target.value)
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleEdit = (a) => {
        setMode("edit")
        setName(a.name)
        setClock(a.time)
        setEmail(a.invitees)
        setShow(true)
    }

    


    return (
        <div>
            <h2>Personal Calendar Web App</h2>
            <div className="parent-days">

                <p>Sunday</p>
                <p>Monday</p>
                <p>Tuesday</p>
                <p>Wednesday</p>
                <p>Thursday</p>
                <p>Friday</p>
                <p>Saturday</p>

            </div>
            <div className="parent">

                {datesBefore.map((item, index) => (
                    <p className="child out-dates" key={index}>{item}</p>
                ))}
                {dateArr.map((item, index) => (
                    <div className="child">
                        <p className="date-number" key={index}>{item}</p>
                        <Button onClick={() => handleShow(item)}>add</Button><br />
                        {data[index]===null
                        ?
                        <p></p>
                        :
                        data[index].map((a,idx)=>(
                            <Button variant="info" onClick={()=>handleEdit(a)}>{idx+1}</Button>
                        ))
                        }
                    </div>
                ))}
                
                {datesAfter.map((item, index) => (
                    <p className="child out-dates" key={index}>{item}</p>
                ))}
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    {mode==="create"?
                    <Modal.Title>Add Event Today</Modal.Title>
                    :
                    <Modal.Title>Edit Event</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>
                    <label>Name</label><br />
                    <input type="text" onChange={handleNameChange} value={name}></input><br />
                    <label>Time</label><br />
                    <input type="time" onChange={handleTimeChange} value={clock}></input><br />
                    <label>Invitees by email</label><br />
                    <input type="text" onChange={handleEmailChange} value={email}></input>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {mode==="create"
                    ?
                    <Button variant="primary" onClick={saveHandler}>Save</Button>
                    :
                    <Button variant="primary" onClick={saveEditHandler}>Save Edit</Button>
                    }
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Calendar