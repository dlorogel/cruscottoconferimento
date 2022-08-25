sap.ui.define([], function () {
    "use strict";

    return {
        XMLND: {
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
                "<Name>{NomeSocieta}</Name>" +
                "<Street>{StreetS}</Street>" +
                "<House_Num1>{House_Num1S}</House_Num1>" +
                "<Post_Code1>{Post_Code1S}</Post_Code1>" +
                "<City1>{City1S}</City1>" +
                "<Region>{RegionS}</Region>" +
                "<Vat_Number>{PartitaIVASocieta}</Vat_Number>" +
                "<Tax_Code>{CodiceFiscaleSocieta}</Tax_Code>" +
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
                "<VTotaleMerceConferita>10.885,00</VTotaleMerceConferita>" +
                "</Row1>" +
                "<Row2>" +
                "<Maggiorazione>Maggiorazione O.M.Q.</Maggiorazione>" +
                "<VMaggiorazione>1.237,50</VMaggiorazione>" +
                "</Row2>" +
                "<Row2>" +
                "<Maggiorazione>Maggiorazione O.M.V.</Maggiorazione>" +
                "<VMaggiorazione>413,63</VMaggiorazione>" +
                "</Row2>" +
                "<Row3>" +
                "<Intergrazione>Intergrazione prezzo del 4% CARCIOFI</Intergrazione>" +
                "<VIntergrazione>131,40</VIntergrazione>" +
                "</Row3>" +
                "<Row3>" +
                "<Intergrazione>Intergrazione prezzo del 4% SPINACI</Intergrazione>" +
                "<VIntergrazione>504,00</VIntergrazione>" +
                "</Row3>" +
                "<Row4>" +
                "<Acconto>Acconto ACAR/1</Acconto>" +
                "<VAcconto>5.200,42</VAcconto>" +
                "</Row4>" +
                "<Row4>" +
                "<Acconto>Acconto ACAR/2</Acconto>" +
                "<VAcconto>1.190,30</VAcconto>" +
                "</Row4>" +
                "<FooterRow1>" +
                "<Imponibile>6.780,81</Imponibile>" +
                "</FooterRow1>" +
                "<FooterRow2>" +
                "<Iva>271,23</Iva>" +
                "</FooterRow2>" +
                "<FooterRow3>" +
                "<TotaleDocumento>7.052,04</TotaleDocumento>" +
                "</FooterRow3>" +
                "</Table5>" +
                "</SubformTotalDocCalc>" +
                "<Spacer1/>" +
                "<SubformSumaryDeliveryNotes>" +
                "<Table4>" +
                "<HeaderRow/>" +
                "<HeaderRow/>" +
                "<Row1>" +
                "<DeliveryNoteNumber>4500000000</DeliveryNoteNumber>" +
                "<Date1>23/2/2021</Date1>" +
                "<MemberDDTNumber>01/O</MemberDDTNumber>" +
                "<Date2>19/2/2021</Date2>" +
                "</Row1>" +
                "<Row1>" +
                "<DeliveryNoteNumber>4500000001</DeliveryNoteNumber>" +
                "<Date1>24/2/2021</Date1>" +
                "<MemberDDTNumber>02/O</MemberDDTNumber>" +
                "<Date2>20/2/2021</Date2>" +
                "</Row1>" +
                "<Row1>" +
                "<DeliveryNoteNumber>4500000002</DeliveryNoteNumber>" +
                "<Date1>25/2/2021</Date1>" +
                "<MemberDDTNumber>03/O</MemberDDTNumber>" +
                "<Date2>21/2/2021</Date2>" +
                "</Row1>" +
                "</Table4>" +
                "<Text3>{Text3}</Text3>" +
                "<Text4>{Text4}</Text4>" +
                "</SubformSumaryDeliveryNotes>" +
                "</Page1>" +
                "<CompanyCode>4101</CompanyCode>" +
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
                "</Row1>"
        }
    };
});