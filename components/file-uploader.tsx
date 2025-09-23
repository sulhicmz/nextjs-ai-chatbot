'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from './button';
import { toast } from './toast';
import type { Attachment } from '@/lib/types';

export function FileUploader({
  chatId,
  attachments,
  setAttachments,
  disabled,
}: {
  chatId: string;
  attachments: Array<Attachment>;
  setAttachments: (attachments: Array<Attachment>) => void;
  disabled: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        type: 'error',
        description: 'File size should be less than 5MB',
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        type: 'error',
        description: 'File type should be JPEG or PNG',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      const newAttachment: Attachment = {
        id: data.pathname,
        filename: file.name,
        mediaType: file.type,
        url: data.url,
        type: 'file',
        size: file.size,
      };

      setAttachments([...attachments, newAttachment]);

      toast({
        type: 'success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        type: 'error',
        description: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        accept="image/jpeg,image/png"
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        type="button"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </Button>
    </div>
  );
}
