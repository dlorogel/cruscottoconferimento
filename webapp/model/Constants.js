sap.ui.define([], function () {
    "use strict";

    return {
        XMLF: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<HeaderLeft>" +
                "<Name>{Name}</Name>" +
                "<Street>{Street}</Street>" +
                "<House_Num1>{House_Num1}</House_Num1>" +
                "<Post_Code1>{Post_Code1}</Post_Code1>" +
                "<City1>{City1}</City1>" +
                "<Region>{Region}</Region>" +
                "<Vat_Number>{Vat_Number}</Vat_Number>" +
                "<Tax_Code>{Tax_Code}</Tax_Code>" +
                "</HeaderLeft>" +
                "<HeaderRight>" +
                "<Doc_Date>{Date}</Doc_Date>" +
                "<NameR>{NomeSocieta}</NameR>" +
                "<StreetR>{StreetS}</StreetR>" +
                "<House_Num1R>{House_Num1S}</House_Num1R>" +
                "<Post_Code1R>{Post_Code1S}</Post_Code1R>" +
                "<City1R>{City1S}</City1R>" +
                "<RegionR>{RegionS}</RegionR>" +
                "<Vat_NumberR>{PartitaIVASocieta}</Vat_NumberR>" +
                "<Tax_CodeR>{CodiceFiscaleSocieta}</Tax_CodeR>" +
                "</HeaderRight>" +
                "<HeaderTexts>" +
                "<Text1>{Text1}</Text1>" +
                "<Text2>{Text2}</Text2>" +
                "</HeaderTexts>" +
                "<PositionData>" +
                "{PositionData}" +
                "</PositionData>" +
                "<SubformSums>" +
                "<Table6>" +
                "<Row1>" +
                "<UM>{UMAll}</UM>" +
                "<SumAllQuantity>{SumAllQuantity}</SumAllQuantity>" +
                "<SumAllTotal>{SumAllTotal}</SumAllTotal>" +
                "</Row1>" +
                "</Table6>" +
                "</SubformSums>" +
                "<SubformOrogelFrescoOnly>" +
                "<Table3>" +
                "<HeaderRow/>" +
                "<HeaderRow/>" +
                "{FrescoOnly}" +
                "</Table3>" +
                "</SubformOrogelFrescoOnly>" +
                "<Spacer1/>" +
                "<SubformTotalDocCalc>" +
                "<Table5>" +
                "<Row1>" +
                "<VTotaleMerceConferita>{VTotaleMerceConferita}</VTotaleMerceConferita>" +
                "</Row1>" +
                "{Maggiorazione}" +
                "{Integrazioni}" +
                "{Acconti}" +
                "<FooterRow1>" +
                "<Imponibile>{Imponibile}</Imponibile>" +
                "</FooterRow1>" +
                "<FooterRow2>" +
                "<Iva>{IVA}</Iva>" +
                "</FooterRow2>" +
                "<FooterRow3>" +
                "<TotaleDocumento>{TotaleDocumento}</TotaleDocumento>" +
                "</FooterRow3>" +
                "</Table5>" +
                "</SubformTotalDocCalc>" +
                "<Spacer1/>" +
                "<SubformSumaryDeliveryNotes>" +
                "<Table4>" +
                "<HeaderRow/>" +
                "<HeaderRow/>" +
                "{Bolle}" +
                "</Table4>" +
                "<Text3>{Text3}</Text3>" +
                "<Text4>{Text4}</Text4>" +
                "</SubformSumaryDeliveryNotes>" +
                "</Page1>" +
                "<CompanyCode>{CompanyCode}</CompanyCode>" +
                "</form1>",
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
                "</Row1>",
            Maggiorazione: "<Row2>" +
                "<Maggiorazione>{Maggiorazione}</Maggiorazione>" +
                "<VMaggiorazione>{VMaggiorazione}</VMaggiorazione>" +
                "</Row2>",
            Integrazioni: "<Row3>" +
                "<Intergrazione>{Intergrazione}</Intergrazione>" +
                "<VIntergrazione>{VIntergrazione}</VIntergrazione>" +
                "</Row3>",
            Acconto: "<Row4>" +
                "<Acconto>Acconto {Acconto}</Acconto>" +
                "<VAcconto>{VAcconto}</VAcconto>" +
                "</Row4>",
            Bolla: "<Row1>" +
                "<DeliveryNoteNumber>{DeliveryNoteNumber}</DeliveryNoteNumber>" +
                "<Date1>{Date1}</Date1>" +
                "<MemberDDTNumber>{MemberDDTNumber}</MemberDDTNumber>" +
                "<Date2>{Date2}</Date2>" +
                "</Row1>"
        }
    };
});