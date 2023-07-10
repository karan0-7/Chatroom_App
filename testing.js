const http = require("http");
const express = require("express");
const app = express();
const {Server} = require("socket.io");
const cors = require("cors");

const {MongoClient} = require("mongodb");
const uri = "mongodb+srv://test123:testing1@cluster0.orlj3fj.mongodb.net/";
const client = new MongoClient(uri);
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"]

  }
});





async function find(client,category,userInfo,userProjection)
{
  await client.connect();
  const result = client.db("Chatroom").collection(category).find(userInfo).project(userProjection).toArray();
  return result;
 
}

async function update(client,category,userInfo,userProjection,third)
{
  await client.connect();
  client.db("Chatroom").collection(category).updateOne(userInfo,userProjection,third)
}

async function insert(client,category,userInfo)
{
  await client.connect();
  client.db("Chatroom").collection(category).insertOne(userInfo)
}


// Run when client connects
io.on("connection", (socket) => {

  socket.on("newUser",async({username,room,img_src})=>{
  let obj  = {"name":username,counter:0,profile_pic:img_src}
  const check = await find(client,"Users",{name:obj.name});
  if(check.length===0){insert(client,"Users",obj);
  const data = await find(client,"Users",{id:room});
  socket.emit("receive_message",{check:true,data});}
  else{socket.emit("receive_message",{check:false})}

  })

  socket.on("joinRoom",async({name,room,profile_pic})=>{
    const data = await  find(client,"Users",{id:room,"sockets":socket.id})
   await update(client,"Users",{id:room},{$push:{sockets:socket.id}})
if(data.length===0){socket.join(room);
   await update(client,"Users",{id:room},{$push:{online_users : {name,profile_pic},messages : {name:"join_status",user_name:name,message:"joined"}}})}
     setTimeout(async()=>{
      const data = await find(client,"Users",{id:room});
  io.to(room).emit("all_messages",data[0]);},500)
  })

  socket.on("changeUsername",async({name,username,room,profile_pic})=>{
   await update(client,"Users",{name:name},{$set:{name:username}})
   
   await update(client,"Users",{id:room, "messages.name":name},{$set:{"messages.$[elem].name":username}},  
   { arrayFilters: [{ "elem.name": { $eq: name } }] }
   )
   await update(client,"Users",{id:room, "online_users.name":name},{$set:{"online_users.$[elem].name":username}},  
   { arrayFilters: [{ "elem.name": { $eq: name } }] }
   )

   await update(client,"Users",{id:room},{$push:{ messages: `${name} has changed their username to ${username}`}})
  })

  socket.on("newPicture",async({name,room,profile_pic})=>{
   await update(client,"Users",{name:name},{$set:{profile_pic:profile_pic}})
   
   await update(client,"Users",{id:room, "messages.name":name},{$set:{"messages.$[elem].profile_pic":profile_pic}},  
   { arrayFilters: [{ "elem.name": { $eq: name } }] }
   )
   await update(client,"Users",{id:room, "online_users.name":name},{$set:{"online_users.$[elem].profile_pic":profile_pic}},  
   { arrayFilters: [{ "elem.name": { $eq: name } }] }
   )

   await update(client,"Users",{id:room},{$push:{ messages: `${name} has changed their Profile Picture.`}})
  })

  socket.on("leaveRoom",async({name,room,profile_pic})=>{
    
    socket.leave(room);
    await update(client,"Users",{id:room},{$pull:{sockets:socket.id}})
    await update(client,"Users",{id:room},{$pull:{online_users : {name,profile_pic},messages : {name:"join_status",user_name:name,message:"left"}}});
    setTimeout(async()=>{
      const data = await find(client,"Users",{id:room});
  io.to(room).emit("all_messages",data[0]);},500)
    
  })
  

  socket.on("getAvatar",async (name)=>{
    const image = await find(client,"Users",{name:name},{_id:false,profile_pic:true})
   socket.emit("profile_pic",image[0].profile_pic);
  })
  // Listen for chatMessage
  socket.on("chatMessage", async(msg) => {
    const data = await find(client,"Users",{name:msg.name});
    const firstMessageTime = data[0]?.firstMessageTime
    const counter = data[0]?.counter;
    const room=msg.room;
    console.log(counter);
    if(counter===0)
    {
    await  update(client,"Users",{name:msg.name},{$set:{firstMessageTime : Math.round(new Date().getTime()/1000,3)},$inc: {counter: 1}})
    await update(client,"Users",{id:room},{$push: { messages: {name:msg.name,message:msg.message,time:new Date().toLocaleTimeString(),profile_pic:msg.profile_pic}}});
    setTimeout(async()=>{const data = await find(client,"Users",{id:room});
    io.to(room.toString()).emit("all_messages",data[0])},500)
    }
   else if(counter>=5)
    { 
      const CurrTime = Math.round(new Date().getTime()/1000,3);
            console.log("here",CurrTime-firstMessageTime)
      if(CurrTime-firstMessageTime<30){socket.emit("limit_exceeded",{value:CurrTime-firstMessageTime})}
      else{await update(client,"Users",{name:msg.name},{$set: {counter: 1,firstMessageTime : CurrTime}});
     await update(client,"Users",{id:room},{$push: { messages: {name:msg.name,message:msg.message,time:new Date().toLocaleTimeString(),profile_pic:msg.profile_pic}}});
     setTimeout(async()=>{const data = await find(client,"Users",{id:room});
     io.to(room.toString()).emit("all_messages",data[0])},500)
    }
    }
    else{
  await update(client,"Users",{id:room},{$push: { messages: {name:msg.name,message:msg.message,time:new Date().toLocaleTimeString(),profile_pic:msg.profile_pic}}});
  await update(client,"Users",{name:msg.name},{$inc: {counter: 1}});

  setTimeout(async()=>{const data = await find(client,"Users",{id:room});
  io.to(room.toString()).emit("all_messages",data[0])},500)
    }  });

    

  // Runs when client disconnects
  
   
  
})


server.listen(5000, () => console.log(`Server running on port 5000`));
