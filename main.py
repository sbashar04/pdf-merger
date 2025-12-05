import os
from PyPDF2 import PdfMerger

def merge_pdfs():
    # Get all the files from current folder.
    files = os.listdir()

    # Identify pdf files and sort them
    pdf_files = sorted([f for f in files if f.endswith('.pdf')])

    # Jodi kono PDF na thake
    if not pdf_files:
        print("No PDF files were found! Please keep some PDF files in this folder.")
        return

    print(f"Total {len(pdf_files)} PDF files were found.")

    # Create thee Merger Object
    merger = PdfMerger()

    try:
        # Add each pdf file to the merge list
        for pdf in pdf_files:
            print(f"Currently Merging: {pdf}...")
            merger.append(pdf)

        # Output file er nam
        output_filename = "Final_Merged_Document.pdf"

        # Save the merged file
        merger.write(output_filename)
        merger.close()

        print(f"\nSuccess! All the pdf files were merged into '{output_filename}'.")

    except Exception as e:
        print(f"There was an error while merging your PDF files: {e}")

if __name__ == "__main__":
    merge_pdfs()
