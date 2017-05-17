////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bitsTheme(){
	//get theme
	var stDat=	actvServ().then(function(p){var p=p.theme
if (p){
	console.log(p)
	try{var p=stDat.theme;}
	catch(err)	{ console.log("cant find theme colour")}
	console.log(p)
	if (p == "") {
		//console.log('e');
   stDat.theme="#0f5f76";
   localStorage.setItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'), JSON.stringify(stDat))

   	//replace default eith theme 
    var bits_theme = $('.bits').css('background-color');
    $('.bits').css('background-color', p);
      //gradient fade
  var bits_theme_min = $('.min-card').css('background');
     $('.min-card').css('background', '-webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(15,95,118,0.13) 12%,rgba(15,95,118,0.24) 22%,'+p+' 93%)');

}}
	
});

}
	function convertHex(hex,opacity){
		//var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).theme;
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
    $('body').html(convertHex(hex,0.5));
}


