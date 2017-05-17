//first check if its first visit to app
function loadvisit(){
 if(localStorage.getItem('bits-vst-'+parseInt(getBitsWinOpt('s'))) == null || localStorage.getItem('bits-vst-'+parseInt(getBitsWinOpt('s'))) == "Skipped tour"){
console.log('new visit to '+parseInt(getBitsWinOpt('s')))
  $('#modalwelcome').modal({ready: function(){
        
document.getElementById("skip").onclick = function() {skipTour()};
document.getElementById("take").onclick = function() {tookTour()};
    }}).openModal();

}

}
function skipTour(){
    console.log("Skipped Tour");
    localStorage.setItem('bits-vst-'+parseInt(getBitsWinOpt('s')),"");
     localStorage.setItem('bits-vst-'+parseInt(getBitsWinOpt('s')),"Skipped tour");
return;
}
function tookTour(){
    console.log("took Tour");
//     $('.tap-target').attr('data-activates','prod-5-counter');
    $('.first-tt').tapTarget('open');
       $('.tap-target-title').html("");
    $('.tap-target-title').append("Choose items");
      $('.tap-target-text').html("");   
     $('.tap-target-text').append("Use this to add or remove products on shopping cart ");
    setTimeout(function(){ nextTapTarget()}, 5000);
   

//  document.getElementsByClassName("first-ol")[0].addEventListener("",function(){
//          nextTapTarget();
//            });
 /////////////////////////////////////////////////////////////////////////////////////////
    localStorage.setItem('bits-vst-'+parseInt(getBitsWinOpt('s')),"");
     localStorage.setItem('bits-vst-'+parseInt(getBitsWinOpt('s')),"Took tour");
     $('#modalwelcome').closeModal();
     //starting the tour
   
   
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