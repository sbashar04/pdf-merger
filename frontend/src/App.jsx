import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Dragging state

  // Create a ref for input element
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  // Trigger click to hidden input
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // On drag start
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent the browser's default behavior
    setIsDragging(true);
  };

  // If the dragging is outside the box
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // On file drag
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    // Update state on file drag
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleMerge = async () => {
    if (!files) return alert("Please select some PDF files first!");

    setLoading(true);
    const formData = new FormData();

    // Loop through selected files and append to formData
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Backend API call
      const response = await fetch('http://127.0.0.1:8000/merge', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Create a blob from the response and trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Merged_File.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to merge PDFs.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong with the server.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Easy PDF Merger</h1>
      <p className="subtitle">Combine multiple PDFs into one simple file.</p>

      <div className="upload-area">
        {/* Hidden Input */}
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {/* Custom Upload Box */}
        <div
          className={`upload-box ${isDragging ? 'dragging' : ''}`}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="icon">📂</div>
          {files ? (
            <p className="file-count">{files.length} files selected</p>
          ) : (
            <p>Click to select or <br/> <strong>Drag & Drop PDF files here</strong></p>
          )}
        </div>
      </div>

      <button className="btn" onClick={handleMerge} disabled={loading}>
        {loading ? "Merging..." : "Merge PDFs Now"}
      </button>

      {/* Info Section - English Version */}
      <div className="info-section">
        <h3>📌 How to Use</h3>
        <ul>
          <li>Select all the PDF files you want to combine.</li>
          <li>Click the 'Merge PDFs Now' button.</li>
          <li>The merged file will download automatically once processed.</li>
        </ul>

        <h3>👥 Who is this for?</h3>
        <p>
          Designed for students, professionals, and anyone dealing with documents regularly.
          It's the perfect solution for combining reports, assignments, or receipts into a single file.
        </p>

        <h3>🚀 Why use this tool?</h3>
        <p>
          Unlike many online tools, this ensures your data privacy. It's completely free,
          secure, and helps keep your documents organized efficiently.
        </p>
      </div>
    </div>
  );
}

export default App;