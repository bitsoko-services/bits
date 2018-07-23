var functionRun = false;

function feedback() {
    $("#feedbackModal").modal("open");
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
            M.toast({
                html: 'Sending feedback...'
            })
            doFetch({
                action: 'storeFeed',
                uid: localStorage.getItem('bits-user-name'),
                product: productQty,
                service: serviceQty,
                text: $("#feedbackText").val(),
                sid:localStorage.getItem('bits-active-service')
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
        })
    }
}
