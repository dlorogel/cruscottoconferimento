sap.ui.define([], function () {

    "use strict";

    return {

        fmFormatDate: function (date) {
            if (date !== "") {
                if (!date) return "";
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "dd-MM-yyyy"
                });
                return dateFormat.format(new Date(date));
            } else {
                return "";
            }
        },
        fmFormatNumber: function (Number) {
            if (Number !== "") {
                if (!Number) return "";
                return parseFloat(Number).toFixed(2);
            } else {
                return "";
            }
        },
        fmIconChange: function (color) {
            return color ? "sap-icon://color-fill" : "";
        }
    };

});