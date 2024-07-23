import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return (
    <div className="w-full border-conversation-border border-2 z-10 flex flex-col h-[100vh] bg-conversation-panel-background">
      <ChatHeader/>
      <ChatContainer/>
      <MessageBar/>
    </div>
  )
}

export default Chat;
