import React from "react";
import { Form, Link, redirect,useActionData,useLoaderData,useLocation,useNavigate } from "react-router-dom";
import { socket } from "./Sockets";

export default function Chatroom()
{
    let[messages,setMessages] = React.useState([]);
    const[check,setCheck] = React.useState();
    const[onlineUsers,setOnlineUsers] = React.useState([]);
    let prevUser;

  const url =new URLSearchParams(useLocation().search);
  const room = url.get("room");
  const profile_pic=url.get("profile")+"&flip=true&scale=150";
  let img_src;
  console.log(room)
  if(room==="Anime community"){img_src="https://i2.wp.com/i.imgur.com/C4EKjFB.jpg"}
  else if(room==="The Intellectuals"){img_src="https://img.freepik.com/premium-vector/funny-albert-einstein-graphic-illustration_24519-1060.jpg"}
  else{img_src="https://i.pinimg.com/originals/7c/a2/7f/7ca27fe6feff8e66ba37834872194315.png"}

function handleSubmit(event)
{
event.preventDefault();
const message = document.getElementById("message").value;
const obj={name:sessionStorage.getItem("name"),message,room,profile_pic}
document.getElementById("message").value="";
socket.emit('chatMessage', obj);
}

function joinRoom()
{console.log(profile_pic)
  socket.emit("joinRoom",{name:sessionStorage.getItem("name"),room,profile_pic})
}

 React.useEffect(()=>{
  socket.on("all_messages", (data) => {
    setMessages(data?.messages?.map((item)=>{
      if(item.name==="join_status" || typeof item==="string")
      {   if(typeof item==="string")
          { return <div className="join_status"><p>{item}</p></div>}
        return <div className="join_status"><p>{item.user_name} has {item.message} the chat.</p></div>}
      else {
      let str=item.time;
      str = str.slice(0,4)+str.slice(7,10);
      if(prevUser!==item.name){prevUser=undefined}
      if(prevUser!==item.name && item.name!==sessionStorage.getItem("name")){
      prevUser=item.name;
      return <div id="first_message_main" >
        <img src={item.profile_pic} alt="not found"/>
        <div id="first_message" className="receiver" >
        <p>{item.name}</p>
        <div>
        <p id="chat_message">{item.message}</p>
        <p id="chat_time">{str}</p>
        </div>
        </div>
      </div>
      }
       
    return  <div className={item.name===sessionStorage.getItem("name")?"sender":"receive"}><p id="chat_message">{item.message}</p><p id="chat_time">{str}</p></div>
  }}))
    setOnlineUsers(data.online_users.map(item =>
<div id="online_user">
  <img src={item.profile_pic} alt="not found" />
  <p>{item.name}</p> 
</div>
    ));
  })})
React.useEffect(()=>{
  socket.on("limit_exceeded", (data) => {
    console.log("exceeded")
setCheck(data.value);setTimeout(()=>{setCheck("")},2000)
})},[socket])
React.useEffect(()=>{
  console.log("new room joined");
  setTimeout(()=>{  socket.emit("getmessages",room);
  joinRoom();
},1500)
},[room])

function handleRoomLeave()
{
  socket.emit("leaveRoom",{name:sessionStorage.getItem("name"),room,profile_pic});
}

  return(<div id="Chatroom">
  <div id="Chatroom_Options">
    <img id="Chatroom_Options_Room_Img" src={img_src} alt="not found" />
    <p>{room}</p>
    <div id="Chatroom_Options_Online_Users">
    <p>Who's online</p>
    <div id="Chatroom_Options_Online_Users_list">
      {onlineUsers}
    </div>
    </div>
    <div id="Chatroom_Options_Div">
    <img id="Chatroom_Options_Dots" src="https://img.icons8.com/?size=512&id=98963&format=png" alt="not found"/>
        
      <div id="Chatroom_Options_Menu_Room">
      <Link to={`/changeUsername?room=${room}&profile=${profile_pic}`}>Change Username</Link>
        <Link to={`/changeProfilePicture?room=${room}&profile=${profile_pic}`}>Change profile picture</Link>
        <div id="Chatroom_Options_Menu_Room_options_top">
        <p>Change room</p>
        <div id="Chatroom_Options_Menu_Room_options">
          <Link onClick={handleRoomLeave} to={`/chatroom?room=Anime community&profile=${profile_pic}`}><p>Anime community</p></Link>
          <Link onClick={handleRoomLeave} to={`/chatroom?room=The Intellectuals&profile=${profile_pic}`}><p>The Intellectuals</p></Link>
          <Link onClick={handleRoomLeave} to={`/chatroom?room=Ricks and Mortys&profile=${profile_pic}` }><p>Ricks and Mortys</p></Link>
        </div>
        </div>
      </div>
    </div>
    </div>
<div id="Chatroom_main">
  {messages && messages}
</div>
<div id="Chatroom_message">
  <Form onSubmit={handleSubmit}>
<input id="message" type="text" name="message" />
<input id="submit" type="submit" value="Submit" />
  </Form>
  {check && <p className="warning">Time Limit exceeded. Please enter another message after {30-check} seconds.</p>} 
</div>
  </div>)
 }