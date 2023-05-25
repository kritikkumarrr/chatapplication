const socket=io();

var username;

var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");


do{
    username=prompt("Enter your Name: ");
}while(!username);

/*It will called when user will join*/ 
socket.emit("new-user-joined",username);

/*Notify that user is joined*/
socket.on('user-connected',(socket_name)=>{
    userjoinleft(socket_name,'joined');
});

/*function to create joined/left status div*/
function userjoinleft(name,status){
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content=`<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

/*Notify that user is left*/
socket.on('user-disconnected',(user)=>{
  userjoinleft(user,'left');
});

/*For updating userslist and usercounts*/
socket.on('user-list',(users)=>{
    users_list.innerHTML="";
    users_arr=Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p=document.createElement('p');
        p.innerHTML=users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;
});

/*For sending messages*/

msg_send.addEventListener('click',()=>{
  let data={
    user: username,
    msg: user_msg.value
  };
  if(user_msg.value!=''){
    appendmessage(data,'outgoing');
    socket.emit('message',data);
    user_msg.value='';
  }
});

function appendmessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
   appendmessage(data,'incoming');

});