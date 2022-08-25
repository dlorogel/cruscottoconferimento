sap.ui.define([], function () {
    "use strict";

    return {

        PositionData: "<Table1><Row1>" +
            "<EffectiveDate>{EffectiveDate}</EffectiveDate>" +
            "<EndOfDate>{EndOfDate}</EndOfDate>" +
            "<Species>{Species}</Species>" +
            "<Seasonality>{Seasonality}</Seasonality>" +
            "<Varieties>{Varieties}</Varieties>" +
            "</Row1><Row2>" +
            "<CertCorporate>{CertCorporate}</CertCorporate>" +
            "<Cert_Product>{Cert_Product}</Cert_Product>" +
            "<Residual>{Residual}</Residual>" +
            "<CertCommercial>{CertCommercial}</CertCommercial>" +
            "<Specification>{Specification}</Specification>" +
            "<Processing>{Processing}</Processing>" +
            "<Origin>{Origin}</Origin>" +
            "</Row2><Row3>" +
            "<CultivationEvents>{CultivationEvents}</CultivationEvents>" +
            "<CarattCollect>{CarattCollect}</CarattCollect>" +
            "<Collection>{Collection}</Collection>" +
            "<Vehicle>{Vehicle}</Vehicle>" +
            "<TechicalService>{TechicalService}</TechicalService>" +
            "<DespositoService>{DespositoService}</DespositoService>" +
            "<CalibrationService>{CalibrationService}</CalibrationService>" +
            "</Row3><Row4>" +
            "<Route>{Route}</Route>" +
            "<Incoterm>{Incoterm}</Incoterm>" +
            "<ExtraService1>{ExtraService1}</ExtraService1>" +
            "<ExtraService2>{ExtraService2}</ExtraService2>" +
            "<ExtraService3>{ExtraService3}</ExtraService3>" +
            "<ExtraService4>{ExtraService4}</ExtraService4>" +
            "<ExtraService5>{ExtraService5}</ExtraService5>" +
            "</Row4><Row5><TableSubform><Table2><HeaderRow/>" +
            "{Rows}" +
            "<FooterRow>" +
            "<U.M>{UM}</U.M>" +
            "<SumQuantity>{SumQuantity}</SumQuantity>" +
            "<SumTotal>{SumTotal}</SumTotal>" +
            "</FooterRow></Table2></TableSubform></Row5><FooterSpacer/></Table1>",
        RowPositionData: "<Row1>" +
            "<ItemCode>{ItemCode}</ItemCode>" +
            "<Quality>{Quality}</Quality>" +
            "<Caliber>{Caliber}</Caliber>" +
            "<UM>{UM}</UM>" +
            "<Quantity>{Quantity}</Quantity>" +
            "<Price>{Price}</Price>" +
            "<Total>{Total}</Total>" +
            "</Row1>",
        FrescoOnly: "<Row1>" +
            "<Species>{Species}</Species>" +
            "<GrossKg>{GrossKg}</GrossKg>" +
            "<TotalAmount>{TotalAmount}</TotalAmount>" +
            "</Row1>"
    };
});