// ---------------------------------------------Jspdf start----------------------------------------------------------------------------------------------
var doc = new jsPDF();
var specialElementHandlers = {
'#editor': function (element, renderer) {
return true;
}
};
$(document).ready(function() {
$('#btn_save').click(function () {
doc.fromHTML($('#adressesModal').html(), 15, 15, {
'width': 170,
'elementHandlers': specialElementHandlers
});
doc.save('BitsWallet_Backup.pdf');
});
});
// ..................................................JSPDF end.....................................................................................
