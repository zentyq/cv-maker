import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function DocumentEditor() {
  const router = useRouter();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Rich text editor commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      
      if (editorRef.current) {
        editorRef.current.innerHTML = data.content || data.text;
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exportDocument = async (format) => {
    setIsExporting(true);
    setError('');
    setShowSaveMenu(false);

    try {
      const content = editorRef.current?.innerHTML || '';
      
      const response = await fetch('/api/export-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          title: documentTitle,
          format 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentTitle}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const convertDocument = async (from, to) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = from === 'pdf' ? '.pdf' : '.doc,.docx';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsExporting(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', to);

        const response = await fetch('/api/convert-document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to convert document');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${to}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsExporting(false);
      }
    };
    
    fileInput.click();
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      execCommand('insertHTML', tableHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const newDocument = () => {
    if (editorRef.current?.innerHTML && confirm('Create new document? Unsaved changes will be lost.')) {
      editorRef.current.innerHTML = '';
      setDocumentTitle('Untitled Document');
    } else if (!editorRef.current?.innerHTML) {
      editorRef.current.innerHTML = '';
      setDocumentTitle('Untitled Document');
    }
  };

  return (
    <>
      <Head>
        <title>{documentTitle} - Document Editor</title>
        <meta name="description" content="Microsoft Office-like document editor with PDF and Word support" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Navigation Bar */}
        <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-blue-400 hover:text-blue-300 transition-all"
                >
                  ← Back to CV Maker
                </button>
                <div className="h-6 w-px bg-gray-600"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Document Editor</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Toolbar */}
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-t-2xl border border-gray-700 border-b-0 p-4">
            {/* Document Title */}
            <div className="mb-4">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent text-white border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Document Title"
              />
            </div>

            {/* File Operations */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-700">
              <button
                onClick={newDocument}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="relative">
                <button
                  onClick={() => setShowSaveMenu(!showSaveMenu)}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {isExporting ? 'Exporting...' : 'Download'}
                </button>
                {showSaveMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[180px]">
                    <button
                      onClick={() => exportDocument('pdf')}
                      className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Download as PDF
                    </button>
                    <button
                      onClick={() => exportDocument('docx')}
                      className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download as Word
                    </button>
                  </div>
                )}
              </div>
              
              {/* Conversion */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => convertDocument('pdf', 'docx')}
                  disabled={isExporting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  PDF → Word
                </button>
                <button
                  onClick={() => convertDocument('docx', 'pdf')}
                  disabled={isExporting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  Word → PDF
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Text Formatting */}
              <div className="flex gap-1">
                <button
                  onClick={() => execCommand('bold')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Bold"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 5H7v10h4a4 4 0 004-4 4 4 0 00-4-4zm0 7H8V6h3a3 3 0 110 6z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('italic')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Italic"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3h6v2h-2.5l-3 10H11v2H5v-2h2.5l3-10H8V3z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('underline')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15a5 5 0 01-5-5V3h2v7a3 3 0 006 0V3h2v7a5 5 0 01-5 5zm-7 2v1h14v-1H3z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('strikeThrough')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Strikethrough"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 9h16v2H2V9zm3-4h10a3 3 0 013 3v1h-2V8a1 1 0 00-1-1H5a1 1 0 00-1 1v1H2V8a3 3 0 013-3zm10 10H5a3 3 0 01-3-3v-1h2v1a1 1 0 001 1h10a1 1 0 001-1v-1h2v1a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              {/* Headings */}
              <div className="flex gap-1">
                <button
                  onClick={() => execCommand('formatBlock', 'h1')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-sm font-bold"
                >
                  H1
                </button>
                <button
                  onClick={() => execCommand('formatBlock', 'h2')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-sm font-bold"
                >
                  H2
                </button>
                <button
                  onClick={() => execCommand('formatBlock', 'h3')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-sm font-bold"
                >
                  H3
                </button>
              </div>

              {/* Alignment */}
              <div className="flex gap-1">
                <button
                  onClick={() => execCommand('justifyLeft')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h10v2H3v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('justifyCenter')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4h14v2H3V4zm2 4h10v2H5V8zm-2 4h14v2H3v-2zm2 4h10v2H5v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('justifyRight')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Align Right"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('justifyFull')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Justify"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h14v2H3v-2zm0 4h14v2H3v-2z" />
                  </svg>
                </button>
              </div>

              {/* Lists */}
              <div className="flex gap-1">
                <button
                  onClick={() => execCommand('insertUnorderedList')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 11-2 0 1 1 0 012 0zm3-1h12v2H6V3zm-3 5a1 1 0 11-2 0 1 1 0 012 0zm3-1h12v2H6V7zm-3 5a1 1 0 11-2 0 1 1 0 012 0zm3-1h12v2H6v-2zm-3 5a1 1 0 11-2 0 1 1 0 012 0zm3-1h12v2H6v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => execCommand('insertOrderedList')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-all"
                  title="Numbered List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3h2v2H2V3zm0 4h2v2H2V7zm0 4h2v2H2v-2zm0 4h2v2H2v-2zM6 3h12v2H6V3zm0 4h12v2H6V7zm0 4h12v2H6v-2zm0 4h12v2H6v-2z" />
                  </svg>
                </button>
              </div>

              {/* Colors & More */}
              <div className="flex gap-1">
                <label className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-all cursor-pointer" title="Text Color">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="color"
                    onChange={(e) => execCommand('foreColor', e.target.value)}
                    className="w-0 h-0 opacity-0"
                  />
                </label>
                <label className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-all cursor-pointer" title="Background Color">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="color"
                    onChange={(e) => execCommand('backColor', e.target.value)}
                    className="w-0 h-0 opacity-0"
                  />
                </label>
              </div>

              {/* Advanced */}
              <div className="flex gap-1">
                <button
                  onClick={insertTable}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-xs"
                >
                  Table
                </button>
                <button
                  onClick={insertImage}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-xs"
                >
                  Image
                </button>
                <button
                  onClick={() => execCommand('createLink', prompt('Enter URL:'))}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all text-xs"
                >
                  Link
                </button>
              </div>

              {/* Font Controls */}
              <div className="flex gap-2 ml-auto">
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    execCommand('fontName', e.target.value);
                  }}
                  className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                </select>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    execCommand('fontSize', '4');
                    document.execCommand('foreColor', false, 'transparent');
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      const span = document.createElement('span');
                      span.style.fontSize = e.target.value + 'px';
                      range.surroundContents(span);
                    }
                  }}
                  className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                </select>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="bg-white rounded-b-2xl shadow-2xl" style={{ minHeight: '600px' }}>
            <style jsx>{`
              [contenteditable] {
                -webkit-user-modify: read-write-plaintext-only;
              }
              [contenteditable]:focus {
                outline: none;
              }
              [contenteditable] * {
                background-color: transparent !important;
              }
            `}</style>
            <div
              ref={editorRef}
              contentEditable
              className="p-12 outline-none"
              style={{
                minHeight: '600px',
                fontFamily: fontFamily,
                fontSize: fontSize + 'px',
                lineHeight: '1.6',
                color: '#000',
                backgroundColor: '#fff',
              }}
              onInput={(e) => setDocumentContent(e.currentTarget.innerHTML)}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
              }}
              suppressContentEditableWarning
            >
              <p>Start typing your document here...</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-xl backdrop-blur-sm">
              <p className="text-red-200 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
