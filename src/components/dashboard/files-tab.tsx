// src/components/dashboard/files-tab.tsx
import { Music, FileText, Eye, Download, Play } from 'lucide-react';

interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

interface FilesTabProps {
  files?: File[];
  onPlay?: (fileId: number) => void;
  onDownload?: (fileId: number) => void;
  onView?: (fileId: number) => void;
}

export default function FilesTab({ files = [], onPlay, onDownload, onView }: FilesTabProps) {
  // Group files by type
  const audioFiles = files.filter(file => 
    file.type.includes('audio') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')
  );
  
  const documentFiles = files.filter(file => 
    file.type.includes('document') || 
    file.type.includes('pdf') || 
    file.name.endsWith('.pdf') || 
    file.name.endsWith('.doc') || 
    file.name.endsWith('.docx')
  );
  
  const handlePlay = (fileId: number) => {
    if (onPlay) onPlay(fileId);
  };
  
  const handleDownload = (fileId: number) => {
    if (onDownload) onDownload(fileId);
  };
  
  const handleView = (fileId: number) => {
    if (onView) onView(fileId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Audio Files</h3>
        <div className="space-y-3">
          {audioFiles.length > 0 ? (
            audioFiles.map(file => (
              <div key={file.id} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3">
                    <Music className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.date} • {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={() => handlePlay(file.id)}
                    aria-label={`Play ${file.name}`}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={() => handleDownload(file.id)}
                    aria-label={`Download ${file.name}`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400 bg-gray-700 bg-opacity-30 rounded-lg">
              <p>No audio files available yet</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Documents</h3>
        <div className="space-y-3">
          {documentFiles.length > 0 ? (
            documentFiles.map(file => (
              <div key={file.id} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 bg-opacity-30 flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.date} • {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={() => handleView(file.id)}
                    aria-label={`View ${file.name}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={() => handleDownload(file.id)}
                    aria-label={`Download ${file.name}`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400 bg-gray-700 bg-opacity-30 rounded-lg">
              <p>No documents available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}