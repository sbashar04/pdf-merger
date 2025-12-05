from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PyPDF2 import PdfMerger
from io import BytesIO
from typing import List

app = FastAPI()

# Permission for allowing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    merger = PdfMerger()

    # In-memory output file
    output_buffer = BytesIO()

    try:
        for file in files:
            # Add each pdf file to the merge list
            pdf_content = await file.read()
            merger.append(BytesIO(pdf_content))

        # Write to Output buffer
        merger.write(output_buffer)
        merger.close()

        # Move the cursor to the top to download
        output_buffer.seek(0)

        # Send the final file to the browser to download
        return StreamingResponse(
            output_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged_document.pdf"}
        )
    except Exception as e:
        return {"error": str(e)}
