"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { generateImageAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemText: string;
}

export function ImageModal({ isOpen, setIsOpen, itemText }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen && itemText) {
      const generate = async () => {
        setLoading(true);
        setImageUrl(null);
        setError(null);
        // The itemText might contain the title and prompt separated by a pipe
        const [displayTitle, imagePrompt] = itemText.split('|');
        setTitle(displayTitle);

        const result = await generateImageAction(imagePrompt || displayTitle);
        if (result.error) {
          setError(result.error);
        } else if (result.imageUrl) {
          setImageUrl(result.imageUrl);
        }
        setLoading(false);
      };
      generate();
    }
  }, [isOpen, itemText]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Visualization for: {title}</DialogTitle>
          <DialogDescription>
            Here is an AI-generated image to help you visualize this item.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center min-h-[300px]">
          {loading && <Skeleton className="h-[300px] w-[300px] rounded-lg" />}
          {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Image Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`AI-generated image of ${title}`}
              width={400}
              height={400}
              className="rounded-lg object-contain"
              unoptimized // Required for data URIs or external URLs not in next.config.js
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
