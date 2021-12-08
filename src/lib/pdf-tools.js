import PdfPrinter from 'pdfmake';




const fonts = {
	Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
};

const printer = new PdfPrinter(fonts);
 export const getBlogPDFReadeableSt= async (blog)=>{const docDefinition = {
	content: [{text: "hello world"}
		
	],
	images: {
		bee: testImageDataUrl
	}
};
const pdfDoc = printer.createPdfKitDocument(docDefinition)
pdfDoc.end()
return pdfDoc
}





