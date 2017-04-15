////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bitsTheme(){
	//get theme
	var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).theme;
	console.log(p)
	if (p == "") {
   localStorage.setItem('bits-merchant-id-'+localStorage.getItem('bits-active-service').theme, "#0f5f76");
}
	//replace default eith theme 
    var bits_theme = $('.bits').css('background-color');
    $('.bits').css('background-color', p);
      //gradient fade
  var bits_theme_min = $('.min-card').css('background');
     $('.min-card').css('background', '-webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(15,95,118,0.13) 12%,rgba(15,95,118,0.24) 22%,'+p+' 93%)');
}
	function convertHex(hex,opacity){
		var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).theme;
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
    $('body').html(convertHex(p,0.5));
}


