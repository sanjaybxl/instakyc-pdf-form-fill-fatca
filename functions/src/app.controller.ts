import { Controller, Get, Header, Res, Query } from '@nestjs/common';
import { Response } from 'express';

var hummus = require('hummus'),
  fillForm = require('./pdf-form-fill').fillForm,
  PDFDigitalForm = require('./pdf-digital-form');
const path = require('path');

@Controller()
export class AppController {
  constructor() { }

  @Get('/filledPdfForm')
  @Header('Content-Type', 'application/pdf')
  getFormFillPdf(@Query() params: any, @Res() res: Response): any {
    const inStream = new hummus.PDFRStreamForFile(path.join(__dirname + '/../sample-forms/fatca-crs.fr.pdf'));
    const pdfWriter = hummus.createWriterToModify(
      inStream,
      new hummus.PDFStreamForResponse(res)
    );
    fillForm(pdfWriter, params);
    pdfWriter.end();
    res.send();
  }

  @Get('/getFormFields')
  @Header('Content-Type', 'application/json; charset=utf-8')
  getPdfFormFields(): any {

    var pdfParser = hummus.createReader(path.join(__dirname + '/../sample-forms/fatca-crs.fr.pdf')); // the path to the pdf file
    var digitalForm = new PDFDigitalForm(pdfParser);
    console.log(digitalForm);

    if (digitalForm.hasForm()) {
      return JSON.stringify(digitalForm, null, 4);
    }
    else return null;
  }


}
