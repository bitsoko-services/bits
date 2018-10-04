//----------------------------------------------bits addMobiVeri--------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------updating addMobiVeri ---------------------------------------------------------------------------------
function addMobiVeri() {
    $(".MobileModal").html("");
    //----------------------------------------------append contact modal--------------------------------------------------------------------------------------
    $(".MobileModal").append('<div class="modal-content" style="padding: 24px 10px; padding-bottom: 0px; text-align:center;"><p style=" text-align: center;">Please enter your phone number so we can call you to confirm your delivery location</p><a id="resendCode" style="text-align:center;display: block; margin-left: auto; margin-right: auto;" onclick="resendCode()">Resend confirmation code</a>' +
        ' <div class="row" style="margin-bottom:0px;">' +
        '<div class="input-field col s8">' +
        '  <i class="mdi-hardware-phone-android prefix"></i>' +
        '  <input id="inp-phone" type="number" class="validate" style="margin-left:0px;width:100%;">' +
        '  <label for="inp-phone" class="" style="margin-left:0px;">Phone number</label>' +
        ' </div>' +
        ' <div class="input-field col s4" style="margin-bottom:0px;">' +
        '  <div class="input-field col s12" style="padding:0px;">' +
        '    <button class="inp-phone btn waves-effect waves-light bits" type="submit" name="action">ok</button>' +
        '  </div>' +
        ' </div>' +
        ' </div>' +
        ' <div class="row">' +
        ' <div class="input-field col s8">' +
        '  <i class="mdi-action-lock-outline prefix"></i>' +
        ' <input id="inp-code" type="number" class="validate" style="margin-left:0px;width:100%;">' +
        '  <label for="inp-code" class="" style="margin-left:0px;width:100%;">confirmation code</label>' +
        ' </div>' +
        ' <div class="input-field col s4">' +
        '  <div class="input-field col s12" style="padding:0px;">' +
        '    <button class="inp-code btn waves-effect waves-light bits" type="submit" name="action" disabled>ok</button>' +
        '  </div>' +
        '  </div>' +
        ' </div>' +

        '</div>' +
        ' <div class="modal-footer blue-grey lighten-5" style="height: auto; padding: 0px;">' +
        ' <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat bits" style="padding: 0px 10px; color: white; margin-right: 10%; background-color:#00AC9A;">Close</a>' +
        '</div>');

    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };
    var myNodeList = document.querySelectorAll('input#inp-phone');
    forEach(myNodeList, function (index, value) {
        value.addEventListener("change", changedPhnNum);
    });
    var myNodeList = document.querySelectorAll('input#inp-code');
    forEach(myNodeList, function (index, value) {
        value.addEventListener("change", changedConfCode);
    });
}

function changedPhnNum(t) {
    console.log($(t.target).val());
    var val = $(t.target).val();

    if ($("#inp-phone").val() == '') {
        M.toast({
            html: 'Error! Input your number'
        });
    } else {
        doFetch({
            action: 'doMobiVeri',
            user: localStorage.getItem('bits-user-name'),
            val: val
        }).then(function (e) {
            if (e.status == 'ok') {
                $('.inp-phone').prop('disabled', true);
                $(".inp-code").attr("disabled", false)
                M.toast({
                    html: 'confirmation code sent'
                });

            } else {

                $('#inp-phone').prop('disabled', false);
                $('#inp-code').prop('disabled', true);
                console.log(e);
            }
        });
    }
}
function resendCode(){
    changedPhnNum($("#inp-phone").val())
}

function changedConfCode(t) {
    console.log($(t.target).val());
    var val = $(t.target).val();

    doFetch({
        action: 'doMobiVeriCode',
        user: localStorage.getItem('bits-user-name'),
        val: val
    }).then(function (e) {
        if (e.status == 'ok') {

            $('#inp-phone').prop('disabled', false);
            $('#inp-code').prop('disabled', true);
            M.toast({
                html: 'Phone Number added'
            });
            $("#MobileModal").modal("close")

        } else {
            console.log(e);
        }
    });

}
