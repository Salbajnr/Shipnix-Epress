import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  File, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye,
  Download,
  Trash2,
  FileText,
  FileImage,
  FileVideo,
  Archive
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  encrypted: boolean;
  verified: boolean;
  thumbnail?: string;
}

interface UploadProgress {
  fileId: string;
  progress: number;
  status: "uploading" | "encrypting" | "completed" | "error";
}

const ALLOWED_FILE_TYPES = {
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
  archives: ['.zip', '.rar', '.7z', '.tar.gz'],
  certificates: ['.p12', '.pfx', '.crt', '.cer', '.pem']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export default function SecureDocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  // const { toast } = useToast();
  const toast = (options: any) => console.log('Toast:', options);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('video')) return <FileVideo className="h-5 w-5 text-purple-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-5 w-5 text-orange-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allAllowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();
    
    if (!allAllowedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} not allowed`;
    }

    // Check total files limit
    if (uploadedFiles.length >= MAX_FILES) {
      return `Maximum ${MAX_FILES} files allowed`;
    }

    return null;
  };

  const simulateUpload = async (file: File): Promise<string> => {
    const fileId = Math.random().toString(36).substring(7);
    
    // Initialize upload progress
    setUploadProgress(prev => [...prev, {
      fileId,
      progress: 0,
      status: "uploading"
    }]);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => prev.map(p => 
        p.fileId === fileId ? { ...p, progress } : p
      ));
    }

    // Simulate encryption phase
    setUploadProgress(prev => prev.map(p => 
      p.fileId === fileId ? { ...p, status: "encrypting" } : p
    ));
    
    await new Promise(resolve => setTimeout(resolve, 500));

    // Complete upload
    setUploadProgress(prev => prev.map(p => 
      p.fileId === fileId ? { ...p, status: "completed" } : p
    ));

    return fileId;
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation) {
        toast({
          title: "Upload Failed",
          description: validation,
          variant: "destructive"
        });
        continue;
      }

      try {
        const fileId = await simulateUpload(file);
        
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          encrypted: true,
          verified: true
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        toast({
          title: "Upload Successful",
          description: `${file.name} has been securely uploaded and encrypted`
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    // Clean up progress after a delay
    setTimeout(() => {
      setUploadProgress([]);
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been securely deleted"
    });
  };

  const downloadFile = (file: UploadedFile) => {
    // In production, this would download the encrypted file
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Secure Document Upload
          </CardTitle>
          <CardDescription>
            Upload sensitive documents with end-to-end encryption and secure storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-muted-foreground mb-4">
              Support for documents, images, and archives up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
            <Button asChild>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  accept={Object.values(ALLOWED_FILE_TYPES).flat().join(',')}
                />
                Select Files
              </label>
            </Button>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploading Files</h4>
              {uploadProgress.map((progress) => (
                <div key={progress.fileId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>File {progress.fileId}</span>
                    <span className="capitalize">{progress.status}</span>
                  </div>
                  <Progress value={progress.progress} className="h-2" />
                </div>
              ))}
            </div>
          )}

          {/* Security Features */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-sm">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Virus Scanning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Digital Signatures</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uploaded Documents ({uploadedFiles.length}/{MAX_FILES})</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Lock className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={file.id}>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      {file.encrypted && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      )}
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFile(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < uploadedFiles.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Type Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Supported File Types</CardTitle>
          <CardDescription>
            Accepted file formats and security guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Allowed File Types</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Documents:</strong> PDF, DOC, DOCX, TXT, RTF
                </div>
                <div>
                  <strong>Images:</strong> JPG, PNG, GIF, BMP, SVG
                </div>
                <div>
                  <strong>Archives:</strong> ZIP, RAR, 7Z, TAR.GZ
                </div>
                <div>
                  <strong>Certificates:</strong> P12, PFX, CRT, CER, PEM
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Security Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Files encrypted with AES-256
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Automatic virus scanning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Digital signature verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Secure deletion after shipment
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection Notice */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Data Protection & Privacy
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                All uploaded documents are encrypted using industry-standard AES-256 encryption. 
                Files are scanned for malware, stored securely, and automatically deleted 30 days 
                after shipment completion. We comply with GDPR, CCPA, and international data 
                protection regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}