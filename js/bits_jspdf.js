// ---------------------------------------------Jspdf start----------------------------------------------------------------------------------------------
function initializePdf() {
    var doc = new jsPDF();
    var specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };
    $('#btn_save').click(function () {
        doc.fromHTML($('#adressesModal').html(), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('BitsWallet_Backup.pdf');
    });
}


// ..................................................JSPDF end.....................................................................................
