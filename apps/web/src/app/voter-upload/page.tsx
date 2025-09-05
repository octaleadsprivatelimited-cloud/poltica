'use client';

import { useState, useRef } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@sarpanch-campaign/ui';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

interface VoterData {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  age?: number;
  gender?: string;
  voterId?: string;
  booth?: string;
  ward?: string;
}

export default function VoterUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [voterData, setVoterData] = useState<VoterData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess('');
      setVoterData([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);

      const response = await fetch('/api/voter/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setVoterData(data.voters || []);
        setSuccess(`Successfully processed ${data.voters?.length || 0} voter records`);
        setPreviewMode(true);
      } else {
        setError(data.error || 'Failed to process file');
      }
    } catch (err) {
      setError('An unexpected error occurred while processing the file');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'Village', 'District', 'State', 'Pincode', 'Age', 'Gender', 'Voter ID', 'Booth', 'Ward'],
      ['John Doe', '9876543210', '9876543210', 'john@example.com', '123 Main St', 'Village A', 'District X', 'State Y', '123456', '35', 'Male', 'ABC1234567', 'Booth 1', 'Ward 1'],
      ['Jane Smith', '9876543211', '9876543211', 'jane@example.com', '456 Oak Ave', 'Village B', 'District Y', 'State Z', '654321', '28', 'Female', 'XYZ9876543', 'Booth 2', 'Ward 2']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voter_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveVoterData = async () => {
    if (voterData.length === 0) {
      setError('No voter data to save');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/voter/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voters: voterData }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully saved ${voterData.length} voter records to your database`);
        setVoterData([]);
        setFile(null);
        setPreviewMode(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(data.error || 'Failed to save voter data');
      }
    } catch (err) {
      setError('An unexpected error occurred while saving data');
    } finally {
      setLoading(false);
    }
  };

  const removeVoter = (index: number) => {
    setVoterData(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Voter Data Upload</h1>
                <p className="text-gray-600">Upload and manage your voter database</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Voter Data
                </CardTitle>
                <CardDescription>
                  Upload Excel or CSV file with voter information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                {/* Template Download */}
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  <p className="text-xs text-gray-500">
                    Use this template to format your data correctly
                  </p>
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {loading ? 'Processing...' : 'Process File'}
                </Button>

                {/* Status Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {success}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Required Fields:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Name (Full name)</li>
                    <li>Phone (10-digit mobile number)</li>
                    <li>Address (Complete address)</li>
                    <li>Village</li>
                    <li>District</li>
                    <li>State</li>
                    <li>Pincode</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Optional Fields:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>WhatsApp (if different from phone)</li>
                    <li>Email</li>
                    <li>Age</li>
                    <li>Gender</li>
                    <li>Voter ID</li>
                    <li>Booth</li>
                    <li>Ward</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            {previewMode && voterData.length > 0 ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Voter Data Preview
                      </CardTitle>
                      <CardDescription>
                        {voterData.length} records found. Review before saving.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPreviewMode(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveVoterData}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        {loading ? 'Saving...' : 'Save to Database'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {voterData.map((voter, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="font-semibold">{voter.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{voter.phone}</span>
                                </div>
                                {voter.whatsapp && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">WhatsApp: {voter.whatsapp}</span>
                                  </div>
                                )}
                                {voter.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{voter.email}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{voter.village}, {voter.district}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {voter.state} - {voter.pincode}
                                </div>
                                {voter.voterId && (
                                  <div className="text-sm text-gray-600">
                                    Voter ID: {voter.voterId}
                                  </div>
                                )}
                                {voter.booth && (
                                  <div className="text-sm text-gray-600">
                                    Booth: {voter.booth}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeVoter(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileSpreadsheet className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Data to Preview
                  </h3>
                  <p className="text-gray-500 text-center">
                    Upload a file to see voter data preview
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
