const taskForm1 = document.querySelector('#taskForm1')
const Username = document.querySelector('#Username')
const Password = document.querySelector('#Password')


 const { ipcRenderer } = require('electron')

 
taskForm1.addEventListener("submit",async e=>{
  e.preventDefault();
  const user={
    name:Username.value,
pass:Password.value 
  }
  ipcRenderer.invoke('get-users',user).then(()=> console.log('new')).catch((err)=> console.error('Error'))   
  
})

ipcRenderer.on('enter', (e, args) => {
  window.close()  
  });