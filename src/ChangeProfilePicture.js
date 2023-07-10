import React from "react";
import { socket } from "./Sockets";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChangeProfilePicture()
{
      const[avatar,setAvatarr] = React.useState();
      const url =new URLSearchParams(useLocation().search);
  const room = url.get("room");
  const profile_pic=url.get("profile")+"&flip=true&scale=150";
      const navigate = useNavigate();

      function setAvatar(event){
      for(let c of document.getElementById("homepage_form_avatar_icons_2").children){c.style.border=""}
      event.target.style.border = "1px solid lightgray"
      setAvatarr(event.target.src)}

      function onSubmit()
      {
        socket.emit("newPicture",{name:sessionStorage.getItem("name"),room:room,profile_pic:avatar});
        navigate(`/chatroom?room=${room}&profile=${avatar}`)

      }


  return(<div id="changeProfilePicture">

    <p>Select your new Profile Picture</p>
    <div id="homepage_form_avatar_icons_2">
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Scooter&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Bear&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Bailey&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Harley&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Chester&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Abby&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Buddy&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Bandit&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Lucy&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Spooky&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Cookie&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Luna&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Rascal&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Baby&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Midnight&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Milo&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Callie&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Sam&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Zoey&flip=true&scale=150" alt="not found" />
          <img onClick={setAvatar}src="https://api.dicebear.com/6.x/adventurer/svg?seed=Lola&flip=true&scale=150" alt="not found" />

        </div>
    <div id="submitpic" onClick={onSubmit}><p>Update</p></div>

  </div>)
}