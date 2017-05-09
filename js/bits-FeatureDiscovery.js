//first check if its first visit to app
function loadvisit(){
 if(localStorage.getItem('bits-vst-'+actvServ().id+'') == null){
console.log('new visit to '+actvServ().id+'')
$('#modalwelcome').closeModal();
setTimeout(function(){$('#modalwelcome').openModal();},250);
document.getElementById("skip").onclick = function() {skipTour()};
document.getElementById("take").onclick = function() {tookTour()};
}


if(localStorage.getItem('bits-vst-'+actvServ().id+'') == "Skipped tour"){
console.log('new visit to '+actvServ().id+'')
$('#modalwelcome').closeModal();
setTimeout(function(){$('#modalwelcome').openModal();},250);
// document.getElementById("skip").onclick = function() {skipTour()};
// document.getElementById("take").onclick = function() {tookTour()};
}


}
function skipTour(){
    console.log("Skipped Tour");
    localStorage.setItem('bits-vst-'+actvServ().id+'',"");
     localStorage.setItem('bits-vst-'+actvServ().id+'',"Skipped tour");

}
function tookTour(){
    console.log("took Tour");
    $('.tap-target').tapTarget('open');
    localStorage.setItem('bits-vst-'+actvServ().id+'',"");
     localStorage.setItem('bits-vst-'+actvServ().id+'',"Took tour");
     $('#modalwelcome').closeModal();
     //starting the tour
      $('.tap-target-title').html("");
    $('.tap-target-title').append("Bits Price Button");
      $('.tap-target-text').html("");   
     $('.tap-target-text').append("see how much you have spent on our price button");
}
function nextTapTarget(){}