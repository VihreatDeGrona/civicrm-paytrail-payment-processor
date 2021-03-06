/*
 * SV Payment widget
 *
 * Usage:
 *
 * Using POST API:
 * SV.widget.initWithForm(id, options)
 *
 * Using REST API:
 * SV.widget.initWithToken(id, token, options)
 *
 * Parameters:
 * - id: defines form id to create widget from
 * - token: Unique token for payment received from REST API
 * - options: Options which allow customization to some lengths.
 *
 * Options is a map of one or more following parameters. All options are optional.
 * - width: Widget width in pixels (default: 630)
 * - height: Widget height in pixels, use value 0 for auto-height (default: 0)
 * - defaultLocale: Locale to show by default. See available locales in documentation.
 * - locales: List of locales to choose from. All are shown by default. See supported locales in documentation
 * - debug: SV Widget supports debugging with Firebug. Set debug:true to enable it. You should disable it in production however! (default: false)
 * - widgetId: Define SV widget id to provide own css customization for root element (default: sv-widget)
 */
var SV = {
    _funcOnComplete: null,
    jQuery: null,
    serviceURL: "https://payment.paytrail.com",
    setServiceURL: function (a) {
        SV.serviceURL = a
    },
    _loadDependencies: function (b) {
        SV._funcOnComplete = b;
        if (typeof jQuery == "undefined") {
            if (typeof $ == "function") {
                SV._log("Another JavaScript framework detected.")
            }
            SV._log("jQuery not found. SV widget will now load jQuery v1.7 using no-conflict mode.");
            SV._getScript("//ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js", SV._loadDependenciesComplete)
        } else {
            var a = jQuery.fn.jquery.split(".");
            if (parseInt(a[0]) < 1 || (parseInt(a[0]) == 1 && parseInt(a[1]) < 4) || (parseInt(a[0]) == 1 && parseInt(a[1]) == 4 && parseInt(a[2]) < 3)) {
                SV._log("jQuery version " + jQuery.fn.jquery + " is unsupported. jQuery 1.4.3 or newer required. SV widget will now load jQuery v1.7 using no-conflict mode.");
                SV._getScript("//ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js", SV._loadDependenciesComplete)
            } else {
                SV._log("jQuery version " + jQuery.fn.jquery + " available. SV widget is able to use that.");
                SV.jQuery = jQuery;
                SV._funcOnComplete()
            }
        }
    },
    _loadDependenciesComplete: function () {
        if (typeof jQuery == "undefined") {
            SV._log("Could not load jQuery, you could try loading it yourself before SV widget");
            return
        }
        SV.jQuery = jQuery.noConflict();
        SV._funcOnComplete()
    },
    _getScript: function (c, e) {
        var b = document.createElement("script"),
            d = document.getElementsByTagName("head")[0],
            a = false;
        b.type = "text/javascript";
        b.src = c;
        b.onload = b.onreadystatechange = function () {
            if (!a && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                b.onload = b.onreadystatechange = null;
                d.removeChild(b);
                e()
            }
        };
        d.appendChild(b)
    },
    _log: function (a) {
        if (typeof (console) !== "undefined" && SV.widget.options.debug == true) {
            console.log("SV: " + a)
        }
    },
    _: function (a) {
        return SV.jQuery("<" + a + "></" + a + ">").css("float", "left").css("clear", "none").css("display", "inline").css("color", "#444444").css("font-weight", "normal").css("font-family", '"Trebuchet MS","Verdana",sans-serif').css("font-size", "14px").css("line-height", "18px").css("text-decoration", "none").css("text-align", "left").css("margin", 0).css("padding", 0).css("height", "auto").css("width", "auto").css("background-image", "none").css("background-color", "transparent").css("border-width", 0)
    },
    _setPosition: function (c, d, b) {
        var a = d.offset().left + b.offset.x,
            e = d.offset().top + b.offset.y;
        if (b.align.y == "above") {
            e -= c.outerHeight()
        } else {
            if (b.align.y == "middle") {
                e -= (c.outerHeight() - d.outerHeight()) / 2
            } else {
                if (b.align.y == "below") {
                    e += d.outerHeight()
                }
            }
        } if (b.align.x == "center") {
            a -= (c.outerWidth() - d.outerWidth()) / 2
        }
        if (a < 5) {
            a = 5
        } else {
            if (a > SV.jQuery(document).width() - c.width() - 5) {
                a = SV.jQuery(document).width() - c.width() - 5
            }
        } if (e < 5) {
            e = 5
        } else {
            if (e > SV.jQuery(document).height() - c.height() - 5) {
                e = SV.jQuery(document).height() - c.height() - 5
            }
        }
        c.offset({
            left: a,
            top: e
        })
    }
};
SV.tooltip = {
    _bindTooltip: function () {
        var a = SV.jQuery(this).data("tooltipHtml");
        var b;
        SV.jQuery(this).mouseenter(function () {
            b = SV.tooltip._show(SV.jQuery(this), a)
        });
        SV.jQuery(this).mouseleave(function () {
            b.fadeOut(200, b.remove)
        })
    },
    _show: function (c, b) {
        var a = SV._("div").css("position", "absolute").css("width", 240).css("z-index", 99999).append(SV._("div").css("-moz-box-shadow", "0px 0px 8px #555").css("-webkit-box-shadow", "0px 0px 8px #555").css("box-shadow", "0px 0px 8px #555").css("-webkit-border-radius", "5px").css("-moz-border-radius", "5px").css("border-radius", "5px").css("background-color", "#aab0b8").css("color", "white").css("padding", 10).html(b)).append(SV._("div").css("width", "100%").css("height", 7).css("background", "url(" + SV.serviceURL + "/gfx/widget/tooltip.png) 50% 0 no-repeat")).hide();
        SV.widget.object.parent().append(a);
        a.fadeIn(200);
        SV._setPosition(a, c, {
            offset: {
                x: 0,
                y: 0
            },
            align: {
                y: "above",
                x: "center"
            }
        });
        return a
    }
};
SV.tabs = {
    _buildTabs: function (d, b) {
        var a = SV._("div");
        a.mouseenter(SV.widget._showInfoLayer);
        a.mouseleave(SV.widget._beginHideInfoLayer);
        SV.jQuery.each(d, function (e, f) {
            a.append(SV._("div").click(SV.tabs._showInfoTab).css("-webkit-border-radius", "5px").css("-moz-border-radius", "5px").css("border-radius", "5px").css("background-color", "#dddddd").css("cursor", "hand").css("cursor", "pointer").css("margin", 10).css("margin-bottom", 0).append(SV._("div").css("background", "url(" + SV.serviceURL + "/gfx/widget/arrows.png) no-repeat 0px -11px").css("width", 11).css("height", 11).css("margin-top", 7).css("margin-left", 7).css("font-size", 6)).append(SV._("h2").css("width", 192).css("margin", 5).css("font-weight", "bold").css("color", "#646464").html(f.title)).append(SV._("p").hide().css("padding", "5px").css("padding-bottom", "15px").css("padding-left", "25px").css("font-size", 12).html(f.content)))
        });
        if (typeof (b) != "undefined" && typeof (b.selectedIndex) != "undefined") {
            var c = a.children().eq(b.selectedIndex);
            c.css("background-color", "#ffffff");
            c.find("div").css("background", "url(" + SV.serviceURL + "/gfx/widget/arrows.png) no-repeat 0px 0px");
            c.find("p").show()
        }
        return a
    },
    _showInfoTab: function () {
        if (SV.jQuery(this).find("p").css("display") == "none") {
            var a = SV.widget.info.find("p");
            a.parent().css("background-color", "#dddddd");
            a.parent().find("div").css("background", "url(" + SV.serviceURL + "/gfx/widget/arrows.png) no-repeat 0px -11px");
            a.slideUp();
            SV.jQuery(this).find("p").slideDown();
            SV.jQuery(this).css("background-color", "#ffffff");
            SV.jQuery(this).find("div").css("background", "url(" + SV.serviceURL + "/gfx/widget/arrows.png) no-repeat 0px 0px")
        }
    }
};
SV.widget = {
    object: null,
    info: null,
    infoTimer: null,
    options: {},
    version: "1.0",
    companyName: null,
    _localeData: {
        da_DK: {
            title: "Dansk",
            loadingText: "Betalingsformer hentes..."
        },
        de_DE: {
            title: "Deutsch",
            loadingText: "Zahlungsarten suchen..."
        },
        et_EE: {
            title: "Eesti",
            loadingText: "Makseviisi otsing..."
        },
        en_US: {
            title: "English",
            loadingText: "Loading payment methods..."
        },
        fr_FR: {
            title: "Fran\u00e7ais",
            loadingText: "Recherche modes de paiement..."
        },
        no_NO: {
            title: "Norsk",
            loadingText: "Henter frem betalingsm&aring;ter..."
        },
        ru_RU: {
            title: "\u0440\u0443\u0441\u0441\u043a\u0438\u0439",
            loadingText: "\u041f\u043e\u0438\u0441\u043a \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u044b\u0445 \u0441\u043f\u043e\u0441\u043e\u0431\u043e\u0432 \u043e\u043f\u043b\u0430\u0442\u044b..."
        },
        fi_FI: {
            title: "Suomi",
            loadingText: "Haetaan maksutapoja..."
        },
        sv_SE: {
            title: "Svenska",
            loadingText: "H&auml;mtar betalningss&auml;tt..."
        }
    },
    initWithForm: function (b, a) {
        SV.widget._setOptions(a);
        SV._loadDependencies(function () {
            SV.widget._initWithForm(b)
        })
    },
    initWithToken: function (c, b, a) {
        SV.widget._setOptions(a);
        SV._loadDependencies(function () {
            SV.widget._initWithToken(c, b)
        })
    },
    _initWithForm: function (d) {
        if (!SV.widget._init(d)) {
            return
        }
        var a = null,
            b = null,
            c = [];
        if (d == null) {
            a = SV.jQuery("form").eq(0)
        } else {
            a = SV.jQuery("#" + d)
        }
        SV._log("Requesting payment methods from server");
        SV.jQuery.each(a.serializeArray(), function (e, f) {
            if (SV.widget.options.charset == "UTF-8") {
                c.push(f.name + "=" + encodeURIComponent(f.value))
            } else {
                c.push(this.name + "=" + escape(this.value).replace(/\+/g, "%2B"))
            }
        });
        b = c.join("&").replace(/ /g, "+") + "&" + SV.jQuery.param(SV.widget.options) + "&locale=" + SV.widget.options.defaultLocale;
        SV.jQuery.ajax({
            url: SV.serviceURL + "/widget/create-with-form?" + b,
            dataType: "jsonp",
            success: function (e) {
                SV.widget._initComplete(e, a)
            }
        })
    },
    _initWithToken: function (d, b) {
        SV._log("Initialize widget with token");
        if (!SV.widget._init(d)) {
            return
        }
        var a = SV.jQuery("#" + d),
            c = SV.jQuery.param(SV.widget.options) + "&token=" + b + "&locale=" + SV.widget.options.defaultLocale;
        SV._log("Requesting payment methods from server");
        SV.jQuery.ajax({
            url: SV.serviceURL + "/widget/create-with-token?" + c,
            dataType: "jsonp",
            success: function (e) {
                SV.widget._initComplete(e, a)
            }
        })
    },
    _initComplete: function (b, a) {
        if (b === true) {
            SV._log("Payment methods retrieved")
        } else {
            SV._log("Server returned an error")
        }
        SV.widget.object.fadeOut("fast", function () {
            a.remove();
            SV.widget._updateWidget(true);
            SV.widget.object.fadeIn("fast")
        })
    },
    _initFailed: function () {
        SV._log("Widget initialization failed")
    },
    _init: function (c) {
        if (SV.widget.options.defaultLocale == undefined) {
            var b = SV.jQuery('input[name="CULTURE"]');
            if (b.length > 0 && SV.widget._localeData[b.val()] != undefined) {
                SV.widget.options.defaultLocale = b.val();
                SV._log("Locale " + SV.widget.options.defaultLocale + " resolved from CULTURE input field.")
            } else {
                SV.widget.options.defaultLocale = "fi_FI"
            }
        }
        SV.widget.options.currency = SV.jQuery('input[name="CURRENCY"]').val();
        var a;
        if (c == null) {
            a = SV.jQuery("form");
            if (a.length > 1) {
                a = a.eq(0);
                if (options.debug == true) {
                    SV._log("More than one forms were found. You should identify form with id. Now using first found form.")
                }
            }
        } else {
            a = SV.jQuery("#" + c)
        } if (a.length < 1) {
            if (options.debug == true) {
                alert("Could not find element with given id: '+id+'")
            }
            return false
        }
        a.hide();
        SV.widget._buildLoader();
        a.after(SV.widget.object);
        return true
    },
    _updateLocales: function () {
        var c = true,
            b = SV.widget.object.find("#sv-widget-locales"),
            a = null;
        SV.jQuery.each(SV.widget.options.locales, function (d, e) {
            if (!SV.widget._localeData[e]) {
                return
            }
            if (!c) {
                b.append(" | ")
            }
            c = false;
            a = SV._("a").attr("href", "#").data("locale", e).css("float", "none").css("font-size", "12px").css("color", "#666666").css("text-decoration", "none").html(SV.widget._localeData[e].title).click(SV.widget._onRequestLocale);
            if (e == SV.widget.options.defaultLocale) {
                a.css("text-decoration", "underline")
            }
            b.append(a)
        })
    },
    _buildLoader: function () {
        var a = "";
        if (SV.widget._localeData[SV.widget.options.defaultLocale]) {
            a = SV.widget._localeData[SV.widget.options.defaultLocale].loadingText
        }
        SV.widget.object = SV._("div").css("width", SV.widget.options.width).css("height", SV.widget.options.height).css("padding", "0px").css("padding-top", 20).css("padding-bottom", 20).css("margin", "0px").css("border", "2px solid #eeeeee").css("background-color", "white").css("-webkit-border-radius", "10px").css("-moz-border-radius", "10px").css("border-radius", "10px").append(SV._("img").attr("src", SV.serviceURL + "/gfx/widget/ajax-loader.gif").attr("alt", SV.widget._tr("Loading payment methods...")).css("margin", "0px").css("margin-left", Math.round(SV.widget.options.width / 2) - 16).css("margin-top", Math.round(SV.widget.options.height / 2) - 16).css("padding", "0px")).append(SV._("strong").css("font-weight", "bold").css("clear", "both").css("font-size", "16px").css("text-align", "center").css("width", "100%").html(a))
    },
    _buildInfoLayer: function () {
        var b = SV.tabs._buildTabs([{
            title: SV.widget._tr("Safety information"),
            content: SV.widget._tr("SECURITY")
        }, {
            title: SV.widget._tr("Payment service provider's information"),
            content: SV.widget._tr("CONTACT_INFO_" + SV.widget.options.currency)
        }, {
            title: SV.widget._tr("Service description"),
            content: SV.widget._tr("SERVICE_DESCRIPTION").replace("COMPANYNAME", SV.widget.companyName)
        }, {
            title: SV.widget._tr("Return policy"),
            content: SV.widget._tr("RETURN_POLICY")
        }, {
            title: SV.widget._tr("Visa and MasterCard payments"),
            content: SV.widget._tr("CARD_PAYMENTS")
        }], {
            selectedIndex: 2
        });
        b.append(SV._("div").css("-webkit-border-radius", "5px").css("-moz-border-radius", "5px").css("border-radius", "5px").css("background-color", "#ffffff").css("margin-bottom", "5px").css("width", "220px").css("margin", 10).append(SV._("img").css("margin-left", 10).attr("src", SV.serviceURL + "/gfx/widget/security.png")));
        var a = SV._("div").hide().mouseenter(SV.widget._undoHideInfoLayer).mouseleave(SV.widget._beginHideInfoLayer).css("position", "absolute").css("background-color", "#aab0b8").css("width", 240).css("z-index", "9999").css("-webkit-border-radius", "5px").css("-moz-border-radius", "5px").css("border-radius", "5px").append(b);
        return a
    },
    _redirectTo: function (a) {
        var b = SV._("div").css("position", "absolute").css("background-color", "white").css("-webkit-border-radius", "5px").css("-moz-border-radius", "5px").css("border-radius", "5px").css("width", SV.widget.object.outerWidth() - 20).css("height", SV.widget.object.outerHeight() - 20).css("left", SV.widget.object.offset().left + 10).css("top", SV.widget.object.offset().top + 10).append(SV._("div").css("width", "100%").css("margin-top", SV.widget.object.height() / 2 - 30).append(SV._("img").attr("src", SV.serviceURL + "/gfx/widget/ajax-loader.gif").attr("alt", SV.widget._tr("Loading payment methods...")).css("margin", "0px").css("margin-left", Math.round(SV.widget.options.width / 2) - 16).css("margin-top", Math.round(SV.widget.options.height / 2) - 16).css("padding", "0px")).append(SV._("strong").css("font-weight", "bold").css("clear", "both").css("font-size", "16px").css("text-align", "center").css("width", "100%").html(SV.widget._tr("Redirecting to selected service..."))).append(SV._("p").css("text-align", "center").css("width", "100%").html(SV.widget._tr("Please remember to return to the vendor's service after completing the payment!")))).hide();
        SV.widget.object.parent().append(b);
        b.fadeIn("fast");
        SV._setPosition(b, SV.widget.object, {
            offset: {
                x: 0,
                y: 0
            },
            align: {
                x: "center",
                y: "middle"
            }
        });
        
        //**** EDIT START *****
        
        CRM.paytrail.paymentButtonClicked(a);
        
        /*
        setTimeout(function () {
            window.location.href = a
        }, 3000);
        */
        
        //****** EDIT ENDS ******
        
        return false
    },
    _setOptions: function (a) {
        if (a == undefined) {
            a = {}
        }
        if (a.debug == undefined) {
            a.debug = false
        }
        if (a.width == undefined) {
            a.width = 500
        }
        if (a.height == undefined) {
            a.height = "auto"
        }
        if (a.widgetId == undefined) {
            a.widgetId = "sv-widget"
        }
        if (a.defaultLocale == undefined) {
            if (a.locale != undefined) {
                a.defaultLocale = a.locale
            } else {
                a.defaultLocale = null
            }
        }
        if (a.locales == undefined) {
            a.locales = ["da_DK", "de_DE", "et_EE", "en_US", "fr_FR", "no_NO", "ru_RU", "fi_FI", "sv_SE"]
        }
        if (a.charset == undefined) {
            a.charset = "UTF-8"
        }
        SV.widget.options = a;
        SV._log("Using options [width:" + a.width + ", height:" + a.height + ", widgetId:" + a.widgetId + ", locales:" + a.locales + ", defaultLocale:" + a.defaultLocale + ", charset:" + a.charset + "]")
    },
    _updateWidget: function (b) {
        SV._log("Updating widget content with locale: " + SV.widget.options.defaultLocale);
        if (SV.widget.info != null) {
            SV.widget.info.remove();
            SV.widget.info = null
        }
        var a = SV.widget.object;
        SV.widget.object = SV.widget.build(SV.widget.options.widgetId);
        if (b == true) {
            SV.widget.object.hide()
        }
        a.replaceWith(SV.widget.object);
        SV.widget._updateLocales()
    },
    _showInfoLayer: function () {
        if (SV.widget.info == null) {
            SV.widget.info = SV.widget._buildInfoLayer();
            SV.widget.object.parent().append(SV.widget.info);
            SV.widget.info.fadeIn(200);
            SV._setPosition(SV.widget.info, SV.jQuery(this), {
                offset: {
                    x: 0,
                    y: -3
                },
                align: {
                    x: "center",
                    y: "below"
                }
            })
        } else {
            SV.widget._undoHideInfoLayer();
            SV.widget.info.fadeIn(200)
        }
    },
    _hideInfoLayer: function () {
        if (SV.widget.info != null) {
            SV.widget.info.fadeOut(200)
        }
    },
    _beginHideInfoLayer: function () {
        if (SV.widget.infoTimer == null) {
            SV.widget.infoTimer = setTimeout(SV.widget._hideInfoLayer, 1000)
        }
    },
    _undoHideInfoLayer: function () {
        if (SV.widget.infoTimer != null) {
            clearTimeout(SV.widget.infoTimer);
            SV.widget.infoTimer = null
        }
    },
    _onToggleCompanyDetails: function () {
        var a = SV.jQuery("#_sv_company_details");
        if (a.css("display") == "none") {
            SV.jQuery(this).html(SV.widget._tr("Hide information"));
            SV.jQuery("#_sv_company_details").slideDown("fast")
        } else {
            SV.jQuery(this).html(SV.widget._tr("Show information"));
            SV.jQuery("#_sv_company_details").slideUp("fast")
        }
        return false
    },
    _onTogglePaymentDetails: function () {
        var a = SV.jQuery("#_sv_payment_details");
        if (a.css("display") == "none") {
            SV.jQuery(this).html(SV.widget._tr("Hide information"));
            SV.jQuery("#_sv_payment_details").slideDown("fast")
        } else {
            SV.jQuery(this).html(SV.widget._tr("Show information"));
            SV.jQuery("#_sv_payment_details").slideUp("fast")
        }
        return false
    },
    _onRequestLocale: function () {
        var a = SV.jQuery(this).data("locale");
        if (SV.widget._localeData[a].texts == undefined) {
            SV.jQuery.ajax({
                url: SV.serviceURL + "/widget/json-get-locale/locale/" + a,
                dataType: "jsonp",
                success: function (b) {
                    SV.widget.options.defaultLocale = b.locale;
                    SV.widget._addLocaleData(b);
                    SV.widget._updateWidget(false)
                }
            })
        } else {
            SV.widget.options.defaultLocale = a;
            SV.widget._updateWidget(false)
        }
        return false
    },
    _addLocaleData: function (a) {
        SV.widget._localeData[a.locale].numberFormat = a.numberFormat;
        SV.widget._localeData[a.locale].texts = a.texts
    },
    _tr: function (a) {
        if (SV.widget._localeData[SV.widget.options.defaultLocale] == undefined || SV.widget._localeData[SV.widget.options.defaultLocale].texts == undefined) {
            return a
        }
        if (SV.widget._localeData[SV.widget.options.defaultLocale].texts[a] == undefined) {
            return a
        }
        return SV.widget._localeData[SV.widget.options.defaultLocale].texts[a]
    },
    _trNumber: function (g, j) {
        var m = ",",
            a = ".",
            b = false,
            n = "",
            c = "",
            h = g.toFixed(2).toString(),
            d = h.split("."),
            f = d[0],
            k = d[1],
            e = 0,
            l = "";
        if (SV.widget._localeData[SV.widget.options.defaultLocale] != undefined && SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat != undefined) {
            if (typeof (SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.thousandSeparator) != "undefined") {
                m = SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.thousandSeparator
            }
            if (typeof (SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.decimalPoint) != "undefined") {
                a = SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.decimalPoint
            }
            if (typeof (SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.appendCurrency) != "undefined") {
                b = SV.widget._localeData[SV.widget.options.defaultLocale].numberFormat.appendCurrency
            }
        }
        while (f.length > 3) {
            for (e = f.length - 1; e > f.length - 4; e--) {
                l = f.charAt(e) + l
            }
            l = m + l;
            f = f.substr(0, f.length - 3)
        }
        if (typeof (j) != "undefined") {
            if (b == true) {
                c = j
            } else {
                n = j
            }
        }
        return n + f + l + a + k + c
    }
};
