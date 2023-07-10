import React from "react";
import { Form, Navigate } from "react-router-dom";
import { socket } from "./Sockets";





export default function HomePage()
{

  const[UserStatus,setUserStatus] = React.useState(false);
  const[check,setCheck] = React.useState(false);
  const[imgSrc,setImgSrc] = React.useState();

  React.useEffect(() => {
    socket.on("receive_message", (data) => {
      setCheck(true);
      setUserStatus(data.check);
    });
  });

  function setAvatar(event)
  {
   for(let c of document.getElementById("homepage_form_avatar_icons_1").children){c.style.border=""}
   event.target.style.border = "1px solid lightgray"
   setImgSrc(event.target.src)
  }

  function handleSubmit(event)
{
  event.preventDefault();
  const username = document.getElementById("username").value;
  const room = document.getElementById("room_name").value;
  sessionStorage.setItem("name",username);
  console.log("submitted"+socket.id)
  socket.emit("newUser",{username:username,room:room,img_src:imgSrc});
  
}

  return(<div id="Homepage">
    <h3>Welcome to ChatUp</h3>
    <p>Make new friends and experience various shades of life by listening to various stories by our User</p>
    <Form onSubmit={handleSubmit}>
      <div id="homepage_form_main">
        <div>
      <label id="label" for="username">Please enter your Username</label>
      <input type="text" name="username" id="username" />
      </div>
      <div>
      <label id="label" for="rooms">Please select a room to join.</label>
      <select id="room_name">
        <option>Anime community</option>
        <option>The Intellectuals</option>
        <option>Ricks and Mortys</option>
      </select>
      </div>
      </div>
      <div id="homepage_form_avatar">
        <p>Please choose your avatar</p>
        <div id="homepage_form_avatar_icons_1">
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
      </div>
      <input id="Homepage_submit" type="submit"  value="Let's Goo"/>
    </Form>
    {check && (UserStatus? <Navigate to={`/chatroom?room=${document.getElementById("room_name").value}&profile=${imgSrc}`} replace={true} />: <p className="warning">The username already exists. Please choose another username</p>)}
  </div>)
}