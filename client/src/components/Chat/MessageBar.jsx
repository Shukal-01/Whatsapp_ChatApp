import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false
})


function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("image", file)
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id
        }
      })
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message
        })
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message
          },
          fromSelf: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click()
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000);
      }
    }
  }, [grabPhoto])

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji))
  }

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message
      })
      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message
      })
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message
        },
        fromSelf: true
      })
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-20 px-4 bg-panel-header-background flex items-center gap-6 z-10">
      {
        !showAudioRecorder && (
          <>
            <div className="flex gap-6">
              <BsEmojiSmile id="emoji-open" onClick={handleEmojiModal} className="text-panel-header-icon cursor-pointer text-xl" title="Emoji" />
              {
                showEmojiPicker && <div className="absolute bottom-24 z-40" style={{ left: 470 }} ref={emojiPickerRef}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              }
              <ImAttachment className="text-panel-header-icon cursor-pointer text-xl" title="Attach File" onClick={() => setGrabPhoto(true)} />
            </div>
            <div className="w-full rounded-lg h-10 flex items-center">
              <input type="text" placeholder="Type a message" className="text-sm bg-input-background focus:outline-none text-white w-full h-10 px-5 py-4 rounded-lg" onChange={(e) => setMessage(e.target.value)} value={message} />
            </div>
            <div className="flex w-10 items-center justify-center">
              <button>
                {
                  message.length ? (
                    <MdSend className="text-panel-header-icon cursor-pointer text-xl" title="Send Message" onClick={sendMessage} />
                  ) : (
                    <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" onClick={() => setShowAudioRecorder(true)} title="Record" />
                  )}
              </button>
            </div>
          </>
        )
      }
      {
        grabPhoto && (<PhotoPicker onChange={photoPickerChange} />)
      }
      {
        showAudioRecorder && (<CaptureAudio hide={setShowAudioRecorder} />)
      }
    </div>
  );
}

export default MessageBar;
