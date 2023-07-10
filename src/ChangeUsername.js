import React from "react";
import { socket } from "./Sockets";
import { useLocation,useNavigate } from "react-router-dom";

export default function ChangeUsername()
{
  const url =new URLSearchParams(useLocation().search);
  const room = url.get("room");
  const profile_pic=url.get("profile")+"&flip=true&scale=150";
const navigate = useNavigate();
function handleSubmit(event)
{
  event.preventDefault();
  const username = document.getElementById("newUsername").value;
  socket.emit("changeUsername",{name:sessionStorage.getItem("name"),username,room,profile_pic});
  sessionStorage.setItem("name",username);
  navigate(`/chatroom?room=${room}&profile=${profile_pic}`)
}

  return(<div id="ChangeUsername">
    <form onSubmit={handleSubmit}>
      <label for="newUsername">Please enter your new Username</label>
      <input id="newUsername" name="newUsername" />
      <input id="usernameSubmit" type="submit" value="Update" />
    </form>


  </div>)
}