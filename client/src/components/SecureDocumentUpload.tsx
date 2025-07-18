import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  X,
  Eye,
  Download,
  Lock,
  Fingerprint
} from "lucide-react";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  encrypted: boolean;
  status: "uploading" | "processing" | "verified" | "failed";
  progress: number;
  url?: string;
}

interface SecureDocumentUploadProps {
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  onUpload?: (files: File[]) => void;
}

export default function SecureDocumentUpload({
  maxFileSize = 10,
  allowedTypes = ["pdf", "jpg", "jpeg", "png", "doc", "docx"],
  onUpload
}: SecureDocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const sizeInMB = file.size / (1024 * 1024);
      
      if (!extension || !allowedTypes.includes(extension)) {
        alert(`File type .${extension} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        return false;
      }
      
      if (sizeInMB > maxFileSize) {
        alert(`File size too large. Maximum size: ${maxFileSize}MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    const newDocuments: UploadedDocument[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      encrypted: true,
      status: "uploading",
      progress: 0
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate upload process
    for (const doc of newDocuments) {
      await simulateUpload(doc.id);
    }

    setIsUploading(false);
    
    if (onUpload) {
      onUpload(validFiles);
    }
  };

  const simulateUpload = async (docId: string) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setDocuments(prev => prev.map(doc => 
            doc.id === docId 
              ? { ...doc, status: "processing", progress: 100 }
              : doc
          ));
          
          // Simulate processing
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === docId 
                ? { ...doc, status: "verified" }
                : doc
            ));
            resolve();
          }, 1000);
        } else {
          setDocuments(prev => prev.map(doc => 
            doc.id === docId 
              ? { ...doc, progress }
              : doc
          ));
        }
      }, 200);
    });
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="secondary">Uploading</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Secure Document Upload</span>
          </CardTitle>
          <CardDescription>
            Upload and encrypt your documents with military-grade security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActive 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop your documents here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <input
                type="file"
                multiple
                accept={allowedTypes.map(type => `.${type}`).join(',')}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </Label>
              <div className="text-xs text-muted-foreground">
                Supported formats: {allowedTypes.join(', ')} • Max size: {maxFileSize}MB
              </div>
            </div>
          </div>

          {/* Security Features */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Your documents are protected with:</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>256-bit AES encryption</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure transmission (TLS 1.3)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Zero-knowledge architecture</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Automatic virus scanning</span>
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Uploaded Documents */}
          {documents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Uploaded Documents</h3>
                <Badge variant="outline">
                  {documents.length} file{documents.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.name)}
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.encrypted && (
                          <Lock className="h-4 w-4 text-green-500" title="Encrypted" />
                        )}
                        {getStatusBadge(doc.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {doc.status === 'uploading' && (
                      <div className="space-y-2">
                        <Progress value={doc.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Uploading... {Math.round(doc.progress)}%
                        </div>
                      </div>
                    )}
                    
                    {doc.status === 'processing' && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Processing and encrypting...</span>
                      </div>
                    )}
                    
                    {doc.status === 'verified' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Document verified and encrypted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Information */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Fingerprint className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Compliance & Security</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• GDPR compliant data handling</p>
              <p>• SOC 2 Type II certified infrastructure</p>
              <p>• ISO 27001 information security management</p>
              <p>• Documents automatically deleted after 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}