sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("it.orogel.cruscottoconferimento.controller.Main", {
            onInit: function () {
            },
            onPressFAD: function (oEvent) {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("FAD");
            }
        });
    });
