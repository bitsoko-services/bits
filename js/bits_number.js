/**
 * handle counter
 */
;(function () {
    'use strict';
    $.fn.handleCounter = function (options) {
        var $input,
            $btnMinus,
            $btnPlugs,
            minimum,
            maximize,
            writable,
            onChange,
            onMinimum,
            onMaximize;
        var $handleCounter = this
        $btnMinus = $handleCounter.find('.counter-minus')
        $input = $handleCounter.find('input')
        $btnPlugs = $handleCounter.find('.counter-plus')
        var defaultOpts = {
            writable: true,
            minimum: 0,
            maximize: null,
            onChange: function(){},
            onMinimum: function(){},
            onMaximize: function(){}
        }
        var settings = $.extend({}, defaultOpts, options)
        minimum = settings.minimum
        maximize = settings.maximize
        writable = settings.writable
        onChange = settings.onChange
        onMinimum = settings.onMinimum
        onMaximize = settings.onMaximize
        if (!$.isNumeric(minimum)) {
            minimum = defaultOpts.minimum
        }
        if (!$.isNumeric(maximize)) {
            maximize = defaultOpts.maximize
        }
        var inputVal = $input.val()
        if (isNaN(parseInt(inputVal))) {
            inputVal = $input.val(0).val()
        }
        if (!writable) {
            $input.prop('disabled', true)
        }

        changeVal(inputVal)
        $input.val(inputVal)
        $btnMinus.click(function () {
            var num = parseInt($input.val())
            if (num > minimum) {
                $input.val(num - 1)
                changeVal(num - 1)
            }
        })
        $btnPlugs.click(function () {
             $(".delivery ").addClass("bits");
               $(".bits-main-price").removeClass("grey");
                $(".bits-main-price ").addClass("bits");
            var num = parseInt($input.val())
            if (maximize==null||num < maximize) {
                $input.val(num + 1)
                changeVal(num + 1)
            }
          //setTimeout(, 3000);
        })
        var keyUpTime
        $input.keyup(function () {
                 
            clearTimeout(keyUpTime)
            keyUpTime = setTimeout(function() {
                var num = $input.val()
                if (num == ''){
                    num = minimum
                    $input.val(minimum)
                }
                var reg = new RegExp("^[\\d]*$")
                if (isNaN(parseInt(num)) || !reg.test(num)) {
                    $input.val($input.data('num'))
                    changeVal($input.data('num'))
                } else if (num < minimum) {
                    $input.val(minimum)
                    changeVal(minimum)
                }else if (maximize!=null&&num > maximize) {
                    $input.val(maximize)
                    changeVal(maximize)
                } else {
                    changeVal(num)
                }
            },300)
        })
        $input.focus(function () {
            var num = $input.val()
            if (num == 0) $input.select()
        })

        function changeVal(num) {
                          $input.data('num', num)
            $btnMinus.prop('disabled', false)
            $btnPlugs.prop('disabled', false)
            if (num <= minimum) {
                $btnMinus.prop('disabled', true)
                onMinimum.call(this, num)
            } else if (maximize!=null&&num >= maximize) {
                $btnPlugs.prop('disabled', true)
                onMaximize.call(this, num)
            }else{
                    tabulateTotals();
            }
            onChange.call(this, num)
        }
        return $handleCounter
    };
})(jQuery)
