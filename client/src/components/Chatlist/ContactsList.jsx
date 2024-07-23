import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import axios from "axios";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchContacts, setSearchContacts] = useState([])
  const [{ }, dispatch] = useStateProvider()

  useEffect(() => {
    if(searchTerm.length){
      const fileteredData = {}
      Object.keys(allContacts).forEach((key) => {
        fileteredData[key] = allContacts[key].filter((obj) => obj.name.toLowerCase().includes(searchTerm.toLowerCase()))
      })
      setSearchContacts(fileteredData)
    }
    else{
      setSearchContacts(allContacts)
    }
  },[searchTerm])

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: {
            users
          }
        } = await axios.get(GET_ALL_CONTACTS);
        // console.log(data)
        setAllContacts(users)
        setSearchContacts(users)
        // if (data.users) {
        //   setAllContacts(data.users);
        // }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    getContacts();
  }, []);  // Fix: Add an empty dependency array to run the effect only once


  return (<div className="h-full flex flex-col">
    <div className="flex h-24 items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white">
        <BiArrowBack className="cursor-pointer text-xl" onClick={() => dispatch({
          type: reducerCases.SET_ALL_CONTACTS_PAGE
        })
        } />
        <span>New Chat</span>
      </div>
    </div>
    <div className="bg-search-input-container-background h-full flex-auto custom-scrollbar overflow-auto">
      <div className="flex py-3 items-center gap-3 h-14">
        <div className="flex bg-panel-header-background mx-4 flex-grow items-center gap-5 px-3 py-1 rounded-lg">
          <div>
            <BiSearchAlt2 className="text-l cursor-pointer text-panel-header-icon" />
          </div>
          <div>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search Contacts " className="bg-transparent text-sm focus:outline-none text-white w-full" />
          </div>
        </div>
      </div>
      {Object.entries(searchContacts).map(([initialLetter, userList]) => {
        return ( userList.length > 0 &&
          <div key={Date.now() + initialLetter}>
            <div className="text-teal-light pl-10 gap-y-5">{initialLetter}</div>
            {
              userList.map(contact => {
                return (
                  <ChatLIstItem
                    data={contact}
                    isContactsPage={true}
                    key={contact.id}
                  />)
              })}
          </div>
        )
      })}
    </div>
  </div>
  )
}

export default ContactsList;
