import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Register: React.FC = () => {
  const [jsonData, setJsonData] = useState<object[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile: File | undefined) => {
    if (!selectedFile) {
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus(null);

    const reader = new FileReader();
    reader.readAsBinaryString(selectedFile);

    reader.onload = (e) => {
      if (!e.target?.result) return;

      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });

        // Read first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data: object[] = XLSX.utils.sheet_to_json(sheet);
        setJsonData(data);
        console.log("Converted JSON:", data);
      } catch (error) {
        console.error("Error processing file:", error);
        setStatus('error');
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setStatus('error');
    };
  };

  // Handle upload to MongoDB
  const handleUpload = async () => {
    if (!jsonData) {
      setStatus('error');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress before actual API call
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/register`, 
        { data: jsonData }
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');
      console.log(response.data.message);
    } catch (error) {
      console.error("Error uploading data:", error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Import Student Data
        </CardTitle>
        <CardDescription>
          Upload an Excel file to bulk import student credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <div className="mb-3 text-sm text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Supported formats: .xlsx, .xls
          </div>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full"
          >
            Select Excel File
          </Button>
        </div>

        {file && (
          <div className="mt-4 p-3 rounded-md flex items-center gap-2">
            <File className="h-5 w-5 text-blue-500" />
            <div className="text-sm font-medium flex-1 truncate">{file.name}</div>
            <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === 'success' && (
          <Alert variant="default" className="mt-4 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Student data has been successfully imported.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem with your file or the upload process.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload}
          disabled={!jsonData || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Import Student Data'}
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default Register;