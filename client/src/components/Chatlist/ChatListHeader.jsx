import React from "react";
import Avatars from "../common/Avatars";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { reducerCases } from "@/context/constants";

function ChatListHeader() {
  const [{userInfo}, dispatch] = useStateProvider()

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE
    })
  }

  return <div className="px-4 h-16 flex justify-between items-center">
    <div className="cursor-pointer">
      <Avatars type="sm" image={userInfo?.profileImage}/>
    </div>
    <div className="flex gap-6">
      <BsFillChatLeftTextFill onClick={handleAllContactsPage} className="text-panel-header-icon cursor-pointer text-xl" title="New chat"/>
      <>
      <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu"/>
      </>
    </div>
  </div>
}

export default ChatListHeader;
