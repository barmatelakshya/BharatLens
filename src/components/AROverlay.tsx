import { useState, useRef } from 'react';
import { processImageWithOverlay } from '@/lib/ocr';
import { detectScript } from '@/lib/scriptDetection';
import Sanscript from '@indic-transliteration/sanscript';

interface TextRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  transliterated?: string;
}

interface AROverlayProps {
  targetScript: string;
}

export function AROverlay({ targetScript }: AROverlayProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [textRegions, setTextRegions] = useState<TextRegion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const { originalImage, textRegions: regions } = await processImageWithOverlay(file);
      setImageUrl(originalImage);
      
      const transliteratedRegions = regions.map(region => {
        const sourceScript = detectScript(region.text);
        const transliterated = Sanscript.t(region.text, sourceScript, targetScript);
        return { ...region, transliterated };
      });
      
      setTextRegions(transliteratedRegions);
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Upload Image for AR Overlay'}
      </button>

      {imageUrl && (
        <div className="relative inline-block">
          <img src={imageUrl} alt="Original" className="max-w-full" />
          {textRegions.map((region, index) => (
            <div
              key={index}
              className="absolute bg-white/90 text-black p-1 text-sm border rounded"
              style={{
                left: region.x,
                top: region.y,
                minWidth: region.width,
                minHeight: region.height
              }}
            >
              {region.transliterated || region.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
