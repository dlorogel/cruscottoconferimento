sap.ui.define([], function () {
    "use strict";

    return {
        PDF: {
            ENTITY: "/PDFSet"
        },
        CAMBIOSTATO: {
            P: ["C", "S", "P"],
            P2: ["C", "P"],
            F: ["C", "F"],
            I: ["E", "I"]
        },
        LIQUIDAZIONE: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<Subform1>" +
                "<Table1>" +
                "<HeaderRow/>" +
                "{NewRow}" +
                "<FooterRow>" +
                "<STotaleMerce>{STotaleMerce}</STotaleMerce>" +
                "<STotaleMaggiorazioni></STotaleMaggiorazioni>" +
                "<STotaleTrasporto>{STotaleTrasporto}</STotaleTrasporto>" +
                "<STotaleAcconto>{STotaleAcconto}</STotaleAcconto>" +
                "<STotaleIVA>{STotaleIVA}</STotaleIVA>" +
                "<STotaleFattura>{STotaleFattura}</STotaleFattura>" +
                "<STotalePartiteCl>{STotalePartiteCl}</STotalePartiteCl>" +
                "<STotalePartiteFo>{STotalePartiteFo}</STotalePartiteFo>" +
                "<STotaleCapitale>{STotaleCapitale}</STotaleCapitale>" +
                "<SSaldo>{SSaldo}</SSaldo>" +
                "</FooterRow>" +
                "</Table1>" +
                "</Subform1>" +
                "</Page1>" +
                "<CompName>{CompName}</CompName>" +
                "<Date>{Date}</Date>" +
                "</form1>",
            ROW: "<Row1>" +
                "<CodiceBP>{CodiceBP}</CodiceBP>" +
                "<RegioneSocForn>{RegioneSocForn}</RegioneSocForn>" +
                "<TotaleMerce>{TotaleMerce}</TotaleMerce>" +
                "<TotaleMaggiorazioni>{TotaleMaggiorazioni}</TotaleMaggiorazioni>" +
                "<TotaleTrasporto>{TotaleTrasporto}</TotaleTrasporto>" +
                "<TotaleAcconto>{TotaleAcconto}</TotaleAcconto>" +
                "<TotaleIVA>{TotaleIVA}</TotaleIVA>" +
                "<TotaleFattura>{TotaleFattura}</TotaleFattura>" +
                "<TotalePartiteCl>{TotalePartiteCl}</TotalePartiteCl>" +
                "<TotalePartiteFo>{TotalePartiteFo}</TotalePartiteFo>" +
                "<TotaleCapitale>{TotaleCapitale}</TotaleCapitale>" +
                "<Saldo>{Saldo}</Saldo>" +
                "</Row1>" +
                "{NewRow}"
        },
        STORICOLIQUIDAZIONE: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<Header>" +
                "<CompanyName>{CompanyName}</CompanyName>" +
                "<MemberCode>{MemberCode}</MemberCode>" +
                "<PartnerName>{PartnerName}</PartnerName>" +
                "<Street>{Street}</Street>" +
                "<HouseNum>{HouseNum}</HouseNum>" +
                "<PostCode>{PostCode}</PostCode>" +
                "<City>{City}</City>" +
                "<Region>{Region}</Region>" +
                "<VATNumber>{VATNumber}</VATNumber>" +
                "<TaxCode>{TaxCode}</TaxCode>" +
                "</Header>" +
                "<Spacer/>" +
                "<PositionData>" +
                "<Table1>" +
                "<HeaderRow/>" +
                "<Row1>" +
                "<TotalGoods>{TotalGoods}</TotalGoods>" +
                "</Row1>" +
                "{NewRow}" +
                "<FooterRow>" +
                "<Balance>{Balance}</Balance>" +
                "</FooterRow>" +
                "</Table1>" +
                "</PositionData>" +
                "</Page1>" +
                "</form1>",
            ROW: "<Row2>" +
                "<DeductionDescription>{DeductionDescription}</DeductionDescription>" +
                "<Data>{Data}</Data>" +
                "<Dare>{Dare}</Dare>" +
                "<Avere>{Avere}</Avere>" +
                "</Row2>" +
                "{NewRow}"
        },
        FATTURA: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<Header>" +
                "<HeaderLeft/>" +
                "<HeaderRight/>" +
                "</Header>" +
                "<PositionData>" +
                "{TABLE1}" +
                "</PositionData>" +
                "<SubformSums>" +
                "<Table6>" +
                "<Row1>" +
                "<UM>{SumAllUM}</UM>" +
                "<SumAllQuantity>{SumAllQuantity}</SumAllQuantity>" +
                "<SumAllTotal>{SumAllTotal}</SumAllTotal>" +
                "</Row1>" +
                "</Table6>" +
                "</SubformSums>" +
                "<SubformOrogelFrescoOnly>" +
                "<Table3>" +
                "<HeaderRow/>" +
                "<HeaderRow/>" +
                "{ROW1TABLE3}" +
                "</Table3>" +
                "</SubformOrogelFrescoOnly>" +
                "<Spacer1/>" +
                "<SubformTotalDocCalc>" +
                "<Table5>" +
                "<Row1>" +
                "<VTotaleMerceConferita>{VTotaleMerceConferita}</VTotaleMerceConferita>" +
                "</Row1>" +
                "{ROW2MAGGIORAZIONE}" +
                "{ROW4ACCONTI}" +
                "<FooterRow1>" +
                "<Imponibile>{Imponibile}</Imponibile>" +
                "</FooterRow1>" +
                "{FOOTERROW2}" +
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
                "{ROW1DDT}" +
                "</Table4>" +
                "</SubformSumaryDeliveryNotes>" +
                "</Page1>" +
                "<CompanyCode>{CompanyCode}</CompanyCode>" +
                "<Type_Invoice>{Type_Invoice}</Type_Invoice>" +
                "<Name>{NameC}</Name>" +
                "<Street>{StreetC}</Street>" +
                "<House_Num1>{House_Num1C}</House_Num1>" +
                "<Post_Code1>{Post_Code1C}</Post_Code1>" +
                "<City1>{City1C}</City1>" +
                "<Region>{RegionC}</Region>" +
                "<Vat_Number>{Vat_NumberC}</Vat_Number>" +
                "<Tax_Code>{Tax_CodeC}</Tax_Code>" +
                "<Doc_Date>{Doc_Date}</Doc_Date>" +
                "<NameR>{NameA}</NameR>" +
                "<StreetR>{StreetA}</StreetR>" +
                "<House_Num1R>{House_Num1A}</House_Num1R>" +
                "<Post_Code1R>{Post_Code1A}</Post_Code1R>" +
                "<City1R>{City1A}</City1R>" +
                "<RegionR>{RegionA}</RegionR>" +
                "<Vat_NumberR>{Vat_NumberA}</Vat_NumberR>" +
                "<Tax_CodeR>{Tax_CodeA}</Tax_CodeR>" +
                "<Text1>{Testo1}</Text1>" +
                "<Text2>{Testo2}</Text2>" +
                "<Text3>{Testo3}</Text3>" +
                "</form1>",
            TABLE1: "<Table1>" +
                "<Row1>" +
                "<EffectiveDate>{DataInizioValiditaD}</EffectiveDate>" +
                "<EndOfDate>{DataFineValiditaD}</EndOfDate>" +
                "<Species>{DescSpecie}</Species>" +
                "<Seasonality>{DescStagionalita}</Seasonality>" +
                "<Varieties>{DescVarieta}</Varieties>" +
                "</Row1>" +
                "<Row2>" +
                "<CertCorporate>{DescCertificazioneAziendale}</CertCorporate>" +
                "<Cert_Product>{DescCertificazioneProdotto}</Cert_Product>" +
                "<Residual>{DescResiduo}</Residual>" +
                "<CertCommercial>{DescCertificazioneCommerciale}</CertCommercial>" +
                "<Specification>{DescSpecifica}</Specification>" +
                "<Processing>{DescLavorazione}</Processing>" +
                "<Origin>{DescOrigine}</Origin>" +
                "</Row2>" +
                "<Row3>" +
                "<CultivationEvents>{DescEventiColtivazione}</CultivationEvents>" +
                "<CarattCollect>{DescCaratteristicaRaccoltaTaglio}</CarattCollect>" +
                "<Collection>{DescServizioRaccoltaTaglio}</Collection>" +
                "<Vehicle>{DescServizioCaricoAutomezzi}</Vehicle>" +
                "<TechicalService>{DescServizioAssistenzaTecnica}</TechicalService>" +
                "<DespositoService>{DescServizioDeposito}</DespositoService>" +
                "<CalibrationService>{DescServizioCalibrazione}</CalibrationService>" +
                "</Row3>" +
                "<Row4>" +
                "<Route>{DescZonaTrasporto}</Route>" +
                "<Incoterm>{DescIncoterm}</Incoterm>" +
                "<ExtraService1>{DescServizioExtra1}</ExtraService1>" +
                "<ExtraService2>{DescServizioExtra2}</ExtraService2>" +
                "<ExtraService3>{DescServizioExtra3}</ExtraService3>" +
                "<ExtraService4>{DescServizioExtra4}</ExtraService4>" +
                "<ExtraService5>{DescServizioExtra5}</ExtraService5>" +
                "</Row4>" +
                "<Row5>" +
                "<TableSubform>" +
                "<Table2>" +
                "<HeaderRow/>" +
                "{ROW1TABLE1}" +
                "<FooterRow>" +
                "<U.M>{U.M}</U.M>" +
                "<SumQuantity>{SumQuantity}</SumQuantity>" +
                "<SumTotal>{SumTotal}</SumTotal>" +
                "</FooterRow>" +
                "</Table2>" +
                "</TableSubform>" +
                "</Row5>" +
                "<FooterSpacer/>" +
                "</Table1>" +
                "{TABLE1}",
            ROW1TABLE1: "<Row1>" +
                "<ItemCode>{ItemCode}</ItemCode>" +
                "<Quality>{Quality}</Quality>" +
                "<Caliber>{Caliber}</Caliber>" +
                "<UM>{UM}</UM>" +
                "<Quantity>{Quantity}</Quantity>" +
                "<Price>{Price}</Price>" +
                "<Total>{Total}</Total>" +
                "</Row1>" +
                "{ROW1TABLE1}",
            ROW1TABLE3: "<Row1>" +
                "<Species>{Species}</Species>" +
                "<GrossKg>{GrossKg}</GrossKg>" +
                "<TotalAmount>{TotalAmount}</TotalAmount>" +
                "</Row1>" +
                "{ROW1TABLE3}",
            ROW2MAGGIORAZIONE: "<Row2>" +
                "<Maggiorazione>{Maggiorazione}</Maggiorazione>" +
                "<VMaggiorazione>{VMaggiorazione}</VMaggiorazione>" +
                "</Row2>" +
                "{ROW2MAGGIORAZIONE}",
            ROW4ACCONTI: "<Row4>" +
                "<Acconto>{Acconto}</Acconto>" +
                "<VAcconto>{VAcconto}</VAcconto>" +
                "</Row4>" +
                "{ROW4ACCONTI}",
            ROW1DDT: "<Row1>" +
                "<DeliveryNoteNumber>{DeliveryNoteNumber}</DeliveryNoteNumber>" +
                "<Date1>{Date1}</Date1>" +
                "<MemberDDTNumber>{MemberDDTNumber}</MemberDDTNumber>" +
                "<Date2>{Date2}</Date2>" +
                "</Row1>" +
                "{ROW1DDT}",
            FOOTERROW2: "<FooterRow2>" +
                "<Percentage>{Percentage}</Percentage>" +
                "<Iva>{Iva}</Iva>" +
                "</FooterRow2>" +
                "{FOOTERROW2}"
        },
        FATTURAFORFETTARIO:{
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<Header>" +
                "<HeaderLeft/>" +
                "<HeaderRight/>" +
                "</Header>" +
                "<SubformTotalDocCalc>" +
                "<Table5>" +
                "<FooterRow1>" +
                "<Imponibile>{Imponibile}</Imponibile>" +
                "</FooterRow1>" +
                "{FOOTERROW2}" +
                "<FooterRow3>" +
                "<TotaleDocumento>{TotaleDocumento}</TotaleDocumento>" +
                "</FooterRow3>" +
                "</Table5>" +
                "</SubformTotalDocCalc>" +
                "<Spacer1/>" +
                "<SubformSumaryDeliveryNotes/>" +
                "</Page1>" +
                "<CompanyCode>{CompanyCode}</CompanyCode>" +
                "<Type_Invoice>{Type_Invoice}</Type_Invoice>" +
                "<Name>{NameC}</Name>" +
                "<Street>{StreetC}</Street>" +
                "<House_Num1>{House_Num1C}</House_Num1>" +
                "<Post_Code1>{Post_Code1C}</Post_Code1>" +
                "<City1>{City1C}</City1>" +
                "<Region>{RegionC}</Region>" +
                "<Vat_Number>{Vat_NumberC}</Vat_Number>" +
                "<Tax_Code>{Tax_CodeC}</Tax_Code>" +
                "<Doc_Date>{Doc_Date}</Doc_Date>" +
                "<NameR>{NameA}</NameR>" +
                "<StreetR>{StreetA}</StreetR>" +
                "<House_Num1R>{House_Num1A}</House_Num1R>" +
                "<Post_Code1R>{Post_Code1A}</Post_Code1R>" +
                "<City1R>{City1A}</City1R>" +
                "<RegionR>{RegionA}</RegionR>" +
                "<Vat_NumberR>{Vat_NumberA}</Vat_NumberR>" +
                "<Tax_CodeR>{Tax_CodeA}</Tax_CodeR>" +
                "<Text1>{Testo1}</Text1>" +
                "<Text2>{Testo2}</Text2>" +
                "<Text3>{Testo3}</Text3>" +
                "</form1>"},
        XMLF: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<HeaderLeft>" +
                "{Number}" +
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
                "{Acconti}" +
                "<FooterRow1>" +
                "<Imponibile>{Imponibile}</Imponibile>" +
                "</FooterRow1>" +
                "<FooterRow2>" +
                "<Percentage>{Percentage}</Percentage>" +
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
        },
        XMLE: {
            XML: '<?xml version="1.0" encoding="UTF-8"?>' +
                "<form1>" +
                "<Page1>" +
                "<Header>" +
                "<CompanyName>{CompanyName}</CompanyName>" +
                "<MemberCode>{MemberCode}</MemberCode>" +
                "<PartnerName>{PartnerName}</PartnerName>" +
                "<Street>{Street}</Street>" +
                "<HouseNum>{HouseNum}</HouseNum>" +
                "<PostCode>{PostCode}</PostCode>" +
                "<City>{City}</City>" +
                "<Region>{Region}</Region>" +
                "<VATNumber>{VATNumber}</VATNumber>" +
                "<TaxCode>{TaxCode}</TaxCode>" +
                "</Header>" +
                "<Spacer/>" +
                "<PositionData>" +
                "<Table1>" +
                "<HeaderRow/>" +
                "<Row1>" +
                "<TotalGoods>{TotalGoods}</TotalGoods>" +
                "</Row1>" +
                "<Row2>" +
                "<DeductionDescription>Fattura vendita MF/4</DeductionDescription>" +
                "<Data>31/7/2020</Data>" +
                "<Dare>6673,92</Dare>" +
                "<Avere></Avere>" +
                "</Row2>" +
                "<Row2>" +
                "<DeductionDescription>Fattura vendita MF/38</DeductionDescription>" +
                "<Data>31/8/2020</Data>" +
                "<Dare>55843,44</Dare>" +
                "<Avere></Avere>" +
                "</Row2>" +
                "<FooterRow>" +
                "<Balance>{Balance}</Balance>" +
                "</FooterRow>" +
                "</Table1>" +
                "</PositionData>" +
                "</Page1>" +
                "</form1>"
        }
    };
});