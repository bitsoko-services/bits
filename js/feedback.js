var functionRun = false;

function feedback() {
    $("#feedbackModal").modal("open");
    $("#feedbackText").characterCounter()
    if (functionRun != true) {
        functionRun = true;
        var productQty;
        var serviceQty;
        var message;
        $(".prdQty input").on("change", function (e) {
            productQty = $(this).attr("rate")
        })
        $(".servQty input").on("change", function (e) {
            serviceQty = $(this).attr("rate")
        })
        $("#sendFeedback").click(function (e) {
            if ($("#feedbackText").val().length < 20) {
                M.toast({
                    html: 'Text area should have at least 40 characters'
                })
            } else {
                if (checkanon() == false) {
                    $("#loginModal").modal("open")
                } else {
                    M.toast({
                        html: 'Sending feedback...'
                    })
                    doFetch({
                        action: 'setStoreFeed',
                        uid: localStorage.getItem('bits-user-name'),
                        product: productQty,
                        service: serviceQty,
                        text: $("#feedbackText").val(),
                        sid: localStorage.getItem('bits-active-service')
                    }).then(function (e) {
                        if (e.status == "ok") {
                            M.toast({
                                html: 'Feed back sent successfully'
                            })
                            $("#feedbackModal").modal("close")
                        } else {
                            M.toast({
                                html: 'Error! Try again later'
                            })
                        }
                    })
                }
            }
        })
    }
}
