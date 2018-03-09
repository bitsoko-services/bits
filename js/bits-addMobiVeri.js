//----------------------------------------------bits addMobiVeri--------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------updating addMobiVeri ---------------------------------------------------------------------------------
function addMobiVeri() {
    //----------------------------------------------append contact modal--------------------------------------------------------------------------------------
    $(".MobileModal").append('<div class="modal-content" style="padding: 24px 10px;">' +
        ' <div class="row">' +
        '<div class="input-field col s9">' +
        '  <i class="mdi-hardware-phone-android prefix"></i>' +
        '  <input id="inp-phone" type="number" class="validate" >' +
        '  <label for="inp-phone" class="">Phone number</label>' +
        ' </div>' +
        ' <div class="input-field col s3">' +
        '  <div class="input-field col s12">' +
        '    <button class="inp-phone btn cyan waves-effect waves-light" type="submit" name="action" disabled><i class="mdi-navigation-refresh"></i></button>' +
        '  </div>' +
        ' </div>' +
        ' </div>' +
        ' <div class="row">' +
        ' <div class="input-field col s9">' +
        '  <i class="mdi-action-lock-outline prefix"></i>' +
        ' <input id="inp-code" type="number" class="validate" >' +
        '  <label for="inp-code" class="">confirmation code</label>' +
        ' </div>' +
        ' <div class="input-field col s3">' +
        '  <div class="input-field col s12">' +
        '    <button class="inp-code btn cyan waves-effect waves-light" type="submit" name="action" disabled><i class="mdi-navigation-refresh"></i></button>' +
        '  </div>' +
        '  </div>' +
        ' </div>' +

        '</div>' +
        ' <div class="modal-footer blue-grey lighten-5" style="height: auto; padding: 0px;">' +
        ' <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat bits" style="padding: 0px 10px; color: white; margin-right: 10%;">Close</a>' +
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

    doFetch({
        action: 'doMobiVeri',
        user: localStorage.getItem('bits-user-name'),
        val: val
    }).then(function (e) {
        if (e.status == 'ok') {
            $('#inp-phone').prop('disabled', true);
            $('#inp-code').prop('disabled', false);
            Materialize.toast('confirmation code sent', 5000);

        } else {

            $('#inp-phone').prop('disabled', false);
            $('#inp-code').prop('disabled', true);
            console.log(e);
        }
    });

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
            Materialize.toast('Phone Number added', 3000);
            $("#MobileModal").closeModal()

        } else {
            console.log(e);
        }
    });

}
