import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { io } from "socket.io-client";
import styled from "styled-components"

const Container = styled.div`
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    padding: 2em;
    min-Height: 650px;
`

const Table = styled.table`
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    thead th {
        padding: 1em;
        background-color: #171940;
        color: white;
    }
    & td, th {
    border: 1px solid #424242;
    text-align: left;
    padding: 12px 16px;
    }
    tr:nth-child(even) {
    background-color: #c6bbf1;
    }
    margin-bottom: 2em;
`

export default function Home() {
    
    const SERVER = "ws://localhost:3333"

    let [connected, setConnected] = useState([])
    let [disconnected, setDisconnected] = useState([])
    let [time, setTime] = useState(new Date().getTime())

    let location = useLocation()
    let query = new URLSearchParams(location.search)
    let data = {
        firstname: query.get("firstname"),
        lastname: query.get("lastname"),
        email: query.get("email")
    }

    let connectSocket = () => {
        const socket = io(SERVER, { query: data});
        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on("users", (data) => {
            setConnected(data.connectedUsers)
            setDisconnected(data.disconnectedUsers)
        })
    }

    useEffect(() => {
        connectSocket()
        let timeInterval = setInterval(() => setTime(new Date().getTime()), 60000)
        return () => clearInterval(timeInterval)
        // eslint-disable-next-line
    }, [])

    let formatDate = (date) => {
        let newDate = new Date(date)
        
        return `${newDate.getHours()}:${newDate.getMinutes()} ${newDate.getDate() + 1}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
        // let time = newDate[1].split(":")
        // let day = newDate[0].split("/")
        // return `${time[0].length === 1 ? `0${time[0]}` : time[0]}:${time[1]} ${day[0].length === 1 ? `0${day[0]}` : day[0]}/${day[1].length === 1 ? `0${day[1]}` : day[1]}/${day[2].substr(2, 2)}`
    }

    let computeDuration = (start, end) => {
        let endDate = new Date(end).getTime()
        let startDate = new Date(start).getTime()
        let duration = endDate - startDate
        let hour = Math.max(0, Math.floor(duration / 3.6e+6))
        let minute = Math.max(0, Math.floor(((duration % 3.6e+6) * 60)/3.6e+6))
        return `${hour}h ${minute}m`
    }

    return (
        <Container>
            <h1>Connected Users</h1>
            <Table className="connected">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Connect Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {connected.map((user) =>
                        <tr key={user.email}>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{formatDate(user.connectedAt)}</td>
                            <td>{computeDuration(user.connectedAt, time)}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <h1>Disconnected Users</h1>
            <Table className="disconnected">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Connect Time</th>
                        <th>Disconnect Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {disconnected.map((user) =>
                        <tr key={user.email}>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{formatDate(user.connectedAt)}</td>
                            <td>{formatDate(user.disconnectedAt)}</td>
                            <td>{computeDuration(user.connectedAt, user.disconnectedAt)}</td>
                            {/* <td>{restau.telephone}</td> */}
                            {/* <td>{restau.genre.split(',').join(', ')}</td> */}
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}