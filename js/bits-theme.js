////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bitsTheme(){
	//get theme
	var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).theme;
	console.log(p)
	//replace default eith theme 
    var bits_theme = $('.bits').css('background-color');
    $('.bits').css('background-color', p);
      //gradient fade
  var bits_theme_min = $('.min-card').css('background');
     $('.min-card').css('background', '-webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(15,95,118,0.13) 12%,rgba(15,95,118,0.24) 22%,'+p+' 93%)');
}
