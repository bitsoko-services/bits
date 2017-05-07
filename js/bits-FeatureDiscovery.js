//first check if its first visit to app
function loadvisit(){
    if(localStorage.getItem('bits-vst-'+actvServ().id+'') == null ){
console.log('new visit to '+actvServ().id+'')
$('#modalwelcome').openModal()
//localStorage.setItem("bits-vst") 
}
}