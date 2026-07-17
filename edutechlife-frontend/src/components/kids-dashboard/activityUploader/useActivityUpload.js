import { useState, useCallback } from 'react';
import { useSmartBoardKids } from '../../../context/SmartBoardKidsContext';
import { extractDocumentText } from '../../../utils/documentParser';
import { analyzeDocumentText } from '../../../utils/api';
import { validateFile } from './uploadHelpers';

export function useActivityUpload() {
  const {
    addUploadedActivity,
    addAnalyzedActivity,
    setDocumentForDani,
  } = useSmartBoardKids();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [subject, setSubject] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [viewingAnalysis, setViewingAnalysis] = useState(null);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      console.error('File validation failed:', validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentAnalysis(null);

    try {
      setUploadStatus('parsing');
      setUploadProgress(30);
      const text = await extractDocumentText(file);

      setUploadStatus('analyzing');
      setUploadProgress(60);
      const analysis = await analyzeDocumentText(text, file.name, subject);

      setUploadProgress(100);
      setUploadStatus('complete');
      setCurrentAnalysis(analysis);

      const newActivity = {
        id: Date.now(),
        name: file.name,
        subject: analysis.subject || subject || 'General',
        status: 'analyzed',
        uploadedAt: new Date(),
        fileType: file.type,
        fileSize: file.size,
        analysis,
      };

      addUploadedActivity(newActivity);
      addAnalyzedActivity({
        ...analysis,
        fileName: file.name,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setUploadProgress(0);

      addUploadedActivity({
        id: Date.now(),
        name: file.name,
        subject: subject || 'General',
        status: 'in-progress',
        uploadedAt: new Date(),
        fileType: file.type,
        fileSize: file.size,
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('idle');
      }, 1500);
    }
  }, [subject, addUploadedActivity, addAnalyzedActivity]);

  const handleTutorWithDani = useCallback((analysis) => {
    setDocumentForDani(analysis);
    const daniButton = document.getElementById('openDaniChat');
    if (daniButton) daniButton.click();
  }, [setDocumentForDani]);

  return {
    isUploading,
    uploadProgress,
    uploadStatus,
    subject,
    setSubject,
    currentAnalysis,
    viewingAnalysis,
    setViewingAnalysis,
    handleUpload,
    handleTutorWithDani,
  };
}
