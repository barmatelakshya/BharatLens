import { useRef, useState, useEffect } from 'react';
import { Camera, Square, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting camera...');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported');
      }

      // Simple camera request
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      console.log('Got media stream');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // Simple play without waiting for metadata
        videoRef.current.play();
        
        setStream(mediaStream);
        setIsStreaming(true);
        toast.success('Camera opened!');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(`Camera failed: ${err.message || 'Unknown error'}`);
      toast.error('Camera failed to open');
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        toast.success('Image captured!');
      }
    }, 'image/jpeg', 0.8);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      toast.info('Camera stopped');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
      toast.success('Image uploaded!');
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {!isStreaming ? (
        <div className="space-y-4">
          <Button 
            onClick={startCamera} 
            disabled={isLoading}
            size="lg" 
            className="w-full h-16 text-lg"
          >
            <Camera className="mr-3 h-6 w-6" />
            {isLoading ? 'Opening Camera...' : 'Open Camera'}
          </Button>
          
          <div className="text-center text-gray-500">or</div>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline" 
            size="lg" 
            className="w-full h-16 text-lg"
          >
            <Upload className="mr-3 h-6 w-6" />
            Upload Image
          </Button>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg bg-black"
            style={{ aspectRatio: '16/9' }}
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button 
              onClick={captureImage}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-6"
            >
              <Square className="mr-2 h-5 w-5" />
              Capture
            </Button>
            
            <Button 
              onClick={stopCamera}
              variant="destructive"
              size="lg"
            >
              Stop
            </Button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
