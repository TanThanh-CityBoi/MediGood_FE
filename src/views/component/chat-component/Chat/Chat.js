import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import Messages from "../Messages/Messages"
import Input from "../Input/Input"
import axios from "axios"
import socketIOClient from "socket.io-client"
import "./Chat.scss"
import { BsDashLg } from "react-icons/bs"
import { MdOutlineOpenInNew } from "react-icons/md"

// const ENDPOINT = "http://project-chat-application.herokuapp.com/"
const host = "http://localhost:5000/"

const Chat = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [users, setUsers] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isOpenBox, setIsOpenBox] = useState(false)

  const userInfo = useSelector((state) => state.userReducer.logedUser)
  const socketRef = useRef()

  // add chat user
  useEffect(() => {}, [])

  useEffect(() => {
    socketRef.current = socketIOClient(host, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      },
      allowRequest: (req, callback) => {
        const noOriginHeader = req.headers.origin === undefined
        callback(null, noOriginHeader)
      }
    })

    socketRef.current.on("connect", () => {
      if (socketRef.current.connected) {
        console.log("connected ở đây sẽ thành công")
        console.log(socketRef.current.connected)
      }
    })

    socketRef.current.emit("sendMessageToAdmin", message)
    axios
      .post("http://localhost:5000/api/v1/user/add-chat-user", {
        name: userInfo._id
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    socketRef.current.on("id", (data) => {
      console.log(data)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  const handleClickSetName = () => {
    socketRef.current.emit("setName", name)
  }

  const handleClickSendMessage = () => {
    socketRef.current.emit("sendMessageToAdmin", message)
    axios
      .post("http://localhost:5000/api/v1/user/add-chat-user", { name })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleClickSend = () => {
    axios
      .post("http://localhost:5000/api/v1/user/send-msg-to-admin", {
        id: name,
        message
      })
      .then((res) => {
        console.log(res)
        socketRef.current.emit("sendMessageToAdmin", message)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const sendMessage = (event) => {
    event.preventDefault()
    console.log("Nguyễn Công Phi")
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <div className="infoBar">
          <div className="leftInnerContainer">
            <h3>Medigood</h3>
          </div>
          <div className="rightInnerContainer">
            {!isOpenBox ? (
              <MdOutlineOpenInNew
                color="#fff"
                className="button-box-chat"
                size={24}
                onClick={() => {
                  setIsOpenBox(true)
                }}
              />
            ) : (
              <BsDashLg
                color="#fff"
                className="button-box-chat"
                onClick={() => {
                  setIsOpenBox(false)
                }}
              />
            )}
          </div>
        </div>
        {isOpenBox && (
          <React.Fragment>
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default Chat
