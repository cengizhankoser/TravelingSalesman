const taskForm2 = document.querySelector('#taskForm2')
const Username1 = document.querySelector('#Username1')
const Password1 = document.querySelector('#Password1')
const Email = document.querySelector('#Email')
const CPassword = document.querySelector('#CPassword1')
const { ipcRenderer } = require('electron')
let users=[];

taskForm2.addEventListener("submit",async e=>{
    e.preventDefault();
    const user={
      email:Email.value,
  name:Username1.value,
  pass:Password1.value 
    }
    if(CPassword.value!==Password1.value){
      ipcRenderer.invoke('not-new', user).then(()=> console.log('new user entered')).catch((err)=> console.error('Error'))
    }else{
      ipcRenderer.invoke('new', user).then(()=> console.log('new user entered')).catch((err)=> console.error('Error'))
     
    }
    taskForm2.reset()
  })

  ipcRenderer.on("new-user-created", (e, arg) => {
    console.log(arg);
    const taskSaved = JSON.parse(arg);
    users.push(taskSaved);
   
    
  });