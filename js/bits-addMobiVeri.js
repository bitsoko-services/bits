function addMobiVeri() {
    $(".MobileModal").html(""), $(".MobileModal").append('<div class="modal-content" style="padding: 24px 10px; padding-bottom: 0px; text-align:center;"><div id="svgHolder" style="width: 80px; border-radius: 50%; -webkit-box-shadow: 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12), 0 11px 15px -7px rgba(0,0,0,.2); box-shadow: 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12), 0 11px 15px -7px rgba(0,0,0,.2); padding: 10px; height: 80px; display: block; margin-left: auto; margin-right: auto; margin-top: -65px; background: white;"><svg id="Capa_1" style="enable-background:new 0 0 480.56 480.56;" version="1.1" viewBox="0 0 480.56 480.56" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px"><path d="M365.354,317.9c-15.7-15.5-35.3-15.5-50.9,0c-11.9,11.8-23.8,23.6-35.5,35.6c-3.2,3.3-5.9,4-9.8,1.8 c-7.7-4.2-15.9-7.6-23.3-12.2c-34.5-21.7-63.4-49.6-89-81c-12.7-15.6-24-32.3-31.9-51.1c-1.6-3.8-1.3-6.3,1.8-9.4 c11.9-11.5,23.5-23.3,35.2-35.1c16.3-16.4,16.3-35.6-0.1-52.1c-9.3-9.4-18.6-18.6-27.9-28c-9.6-9.6-19.1-19.3-28.8-28.8 c-15.7-15.3-35.3-15.3-50.9,0.1c-12,11.8-23.5,23.9-35.7,35.5c-11.3,10.7-17,23.8-18.2,39.1c-1.9,24.9,4.2,48.4,12.8,71.3 c17.6,47.4,44.4,89.5,76.9,128.1c43.9,52.2,96.3,93.5,157.6,123.3c27.6,13.4,56.2,23.7,87.3,25.4c21.4,1.2,40-4.2,54.9-20.9 c10.2-11.4,21.7-21.8,32.5-32.7c16-16.2,16.1-35.8,0.2-51.8C403.554,355.9,384.454,336.9,365.354,317.9z"></path><path d="M346.254,238.2l36.9-6.3c-5.8-33.9-21.8-64.6-46.1-89c-25.7-25.7-58.2-41.9-94-46.9l-5.2,37.1 c27.7,3.9,52.9,16.4,72.8,36.3C329.454,188.2,341.754,212,346.254,238.2z"></path><path d="M403.954,77.8c-42.6-42.6-96.5-69.5-156-77.8l-5.2,37.1c51.4,7.2,98,30.5,134.8,67.2c34.9,34.9,57.8,79,66.1,127.5 l36.9-6.3C470.854,169.3,444.354,118.3,403.954,77.8z"></path></svg></div><p style="text-align: center;">Please enter your phone number so we can call you to confirm your delivery location</p><a id="resendCode" onclick="resendCode()" style="text-align:center;display: block; margin-left: auto; margin-right: auto;">Resend confirmation code</a><div class="row" style="margin-bottom:0px;"><div class="input-field col s8"><i class="mdi-hardware-phone-android prefix"></i> <input class="validate" id="inp-phone" style="margin-left:0px;width:100%;" type="number"> <label class="" for="inp-phone" style="margin-left:0px;">Phone number</label></div><div class="input-field col s4" style="margin-bottom:0px;"><div class="input-field col s12" style="padding:0px;"><button class="inp-phone btn waves-effect waves-light bits" name="action" style="" type="submit">ok</button></div></div></div><div class="row"><div class="input-field col s8"><i class="mdi-hardware-phone-android prefix"></i> <input class="validate" id="inp-code" style="margin-left:0px;width:100%;" type="number"> <label class="" for="inp-code" style="margin-left:0px;">Confirmation code</label></div><div class="input-field col s4"><div class="input-field col s12" style="padding:0px;"><button class="inp-code btn waves-effect waves-light bits" disabled="" name="action" style="" type="submit">ok</button></div></div></div></div><div class="modal-footer blue-grey lighten-5" style="height: auto; padding: 0px;"><a class=" modal-action modal-close waves-effect waves-green btn-flat bits" href="#!" style="padding: 0px 10px; color: white; margin-right: 10%;">Close</a></div>');
    var e = function(e, t, a) {
        for (var i = 0; i < e.length; i++) t.call(a, i, e[i])
    };
    e(document.querySelectorAll("input#inp-phone"), function(e, t) {
        t.addEventListener("change", changedPhnNum)
    }), e(document.querySelectorAll("input#inp-code"), function(e, t) {
        t.addEventListener("change", changedConfCode)
    }), mobiVeriModal = document.querySelectorAll(".MobileModal"), M.Modal.init(mobiVeriModal, {
        onCloseStart: function() {}
    })
}

function changedPhnNum(e) {
    if ($("#inp-phone").val() == "") {
        M.toast({
            html: "Error! Input your number"
        })
    } else {
        $('.inp-phone').html('<div class="preloader-wrapper small active" style=" width: 25px; height: 25px; margin-top: 5px;"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>');
        doFetch({
            action: "doMobiVeri",
            user: localStorage.getItem("bits-user-name"),
            val: $('#inp-phone').val()
        }).then(function(e) {
            $('.inp-phone').html('ok');
            "ok" == e.status ? ($(".inp-phone").prop("disabled", !0), $(".inp-code").attr("disabled", !1), M.toast({
                html: "confirmation code sent"
            })) : ($("#inp-phone").prop("disabled", !1), $("#inp-code").prop("disabled", !0), console.log(e))
        })
    }
}

function resendCode() {
    changedPhnNum($("#inp-phone").val())
}

function changedConfCode(e) {
    $('.inp-code').html('<div class="preloader-wrapper small active" style=" width: 25px; height: 25px; margin-top: 5px;"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')
    doFetch({
        action: "doMobiVeriCode",
        user: localStorage.getItem("bits-user-name"),
        val: $('#inp-phone').val()
    }).then(function(e) {
        $('.inp-code').html('ok');
        "ok" == e.status ? ($("#inp-phone").prop("disabled", !1), $("#inp-code").prop("disabled", !0), M.toast({
            html: "Phone Number added"
        }), M.Modal.init(document.getElementById('MobileModal'), {}).close()) : console.log(e)
    })
}
