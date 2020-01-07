import {
  Controller,
  Get,
  Header,
  Res,
  Query,
  Post,
  UseInterceptors,
  UploadedFile
} from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName } from "./services/filenameHandler";


var hummus = require("hummus"),
  fillForm = require("./pdf-form-fill").fillForm,
  PDFDigitalForm = require("./pdf-digital-form");
const path = require("path");

@Controller()
export class AppController {
  constructor() {}

  @Get("/filledPdfForm")
  @Header("Content-Type", "application/pdf")
  getFormFillPdf(@Query() params: any, @Res() res: Response): any {
    this.handleFilledPdfForm(
      res,
      params,
      path.join(__dirname + "/../sample-forms/fatca-crs.fr.pdf")
    );
  }
  handleFilledPdfForm(res: any, params: any, file: any) {
    const inStream = new hummus.PDFRStreamForFile(file);
    const pdfWriter = hummus.createWriterToModify(
      inStream,
      new hummus.PDFStreamForResponse(res)
    );
    fillForm(pdfWriter, params);
    pdfWriter.end();
    res.send();
  }

  @Post("/uploadtoexpectfilledpdf")
  @Header("Content-Type", "application/pdf")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploadedfiles",
        filename: editFileName
      })
    })
  )
  uploadFile(
    @UploadedFile() file: any,
    @Query() params: any,
    @Res() res: Response
  ) {
    this.handleFilledPdfForm(res, params,  `${file.path}`);
  }
  
  @Get("/getFormFields")
  @Header("Content-Type", "application/json; charset=utf-8")
  getPdfFormFields(): any {
    return this.getPdfFormFieldsHelper(
      path.join(__dirname + "/../sample-forms/fatca-crs.fr.pdf")
    );
  }

  @Post("/uploadtoexpectformfields")
  @Header("Content-Type", "application/json; charset=utf-8")
  @UseInterceptors(FileInterceptor("file",{
    storage: diskStorage({
      destination: "./uploadedfiles",
      filename: editFileName
    })
  }))
  uploadFileAndGetFormFileds(@UploadedFile() file:any) {
    this.getPdfFormFieldsHelper(`${file.path}`);
  }

  getPdfFormFieldsHelper(file: any): any {
    var pdfParser = hummus.createReader(file); // the path to the pdf file
    var digitalForm = new PDFDigitalForm(pdfParser);
    console.log(digitalForm);

    if (digitalForm.hasForm()) {
      return JSON.stringify(digitalForm, null, 4);
    } else return null;
  }
}
