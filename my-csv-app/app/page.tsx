// Ensure to install @types/react-dropzone if not installed yet
// npm install --save-dev @types/react-dropzone

'use client'
import React, { useState, ChangeEvent } from 'react';
import XLSX, { write, utils, read } from 'xlsx';
import { useDropzone } from 'react-dropzone';
import Navbar from './components/navbar';

const dropzoneStyle: React.CSSProperties = {
  border: '2px dashed #3498db',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  margin: '20px',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const inputStyle: React.CSSProperties = {
  margin: '10px',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #3498db',
  fontSize: '16px',
  textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#fff',
  padding: '20px',
  borderRadius: '4px',
  fontSize: '18px',
  cursor: 'pointer',
  marginTop: '10px',
  border: '1px solid #3498db',
  outline: 'none',
};
/* teste */
const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  alignContent: 'flex-end',
  marginBottom: '20px'
};

// ... (importações e estilos anteriores)

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [parts, setParts] = useState<number>(1);

  const onDrop = async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const handlePartsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParts = parseInt(event.target.value, 10);
    setParts(newParts);
  };

  const handleDownload = () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet: XLSX.Sheet = workbook.Sheets[sheetName];

      const data = utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      // Filtra apenas linhas não vazias
      const nonEmptyRows = data.filter((row) => row.some(cellValue => cellValue.trim() !== ''));

      const totalRows = nonEmptyRows.length;
      const rowsPerPart = Math.ceil(totalRows / parts);

      // Assume que a primeira linha é o cabeçalho
      const header = nonEmptyRows.shift() || [];

      for (let i = 0; i < parts; i++) {
        const startRow = i * rowsPerPart;
        const endRow = Math.min((i + 1) * rowsPerPart, totalRows);

        // Adiciona o cabeçalho apenas uma vez antes do loop
        const slicedData: string[][] = [header];

        // Adiciona as linhas correspondentes a cada parte
        slicedData.push(...nonEmptyRows.slice(startRow, endRow));

        if (slicedData.length > 0) {
          const slicedWorkbook = utils.book_new();
          const slicedWorksheet = utils.aoa_to_sheet(slicedData);
          utils.book_append_sheet(slicedWorkbook, slicedWorksheet, 'Sheet 1');

          const blob = new Blob([write(slicedWorkbook, { bookType: 'xlsx', type: 'array' })]);

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `part_${i + 1}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ color: '#3498db', marginBottom: '20px', fontSize: '40px' }}>Manipulação de Arquivo Excel (XLS)</h1>
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p style={{ fontSize: '18px' }}>Arraste e solte o arquivo Excel (XLS) aqui ou clique para fazer o upload.</p>
        </div>
        <label>
          Partes:
          <input type="number" value={parts} onChange={handlePartsChange} style={inputStyle} />
        </label>
        <button onClick={handleDownload} style={buttonStyle}>
          Dividir e Baixar
        </button>
      </div>
      <footer style={footerStyle}>
        <p>Development By MarcosJr</p>
      </footer>
    </>
  );
}
