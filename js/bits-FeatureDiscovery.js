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
//     $('.tap-target').attr('data-activates','prod-5-counter');
    $('.first-tt').tapTarget('open');
     document.getElementsByClassName("first-ol")[0].addEventListener("pointerdown", function(){
   nextTapTarget();
});
 $('.first-tt').tapTarget('open');
     document.getElementsByClassName("first-ol")[0].addEventListener("click", function(){
   nextTapTarget();
});
//  document.getElementsByClassName("first-ol")[0].addEventListener("",function(){
//          nextTapTarget();
//            });
 /////////////////////////////////////////////////////////////////////////////////////////
    localStorage.setItem('bits-vst-'+actvServ().id+'',"");
     localStorage.setItem('bits-vst-'+actvServ().id+'',"Took tour");
     $('#modalwelcome').closeModal();
     //starting the tour
   
      $('.tap-target-title').html("");
    $('.tap-target-title').append("Choose items");
      $('.tap-target-text').html("");   
     $('.tap-target-text').append("Use this to add or remove products on shopping cart");
}
function nextTapTarget(){
      $('.first-tt').tapTarget('close');
   $('.second-tt').tapTarget('open');
    $('.tap-target-title').html("");
    $('.tap-target-title').append("Deliveries");
      $('.tap-target-text').html("");   
     $('.tap-target-text').append("Click to request deliveries");
   //setTimeout(function(){$('.tap-target').attr('data-activates','bits-prices').tapTarget('open')},800);
}