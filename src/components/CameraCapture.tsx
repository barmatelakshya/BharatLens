import { useRef, useState } from 'react';
import { Camera, Square, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      setError('');
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setIsStreaming(true);
        toast.success('Camera started successfully');
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      let errorMessage = 'Camera access failed. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported in this browser.';
      } else {
        errorMessage += 'Please try uploading an image instead.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        toast.success('Image captured successfully!');
      }
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      toast.info('Camera stopped');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCapture(file);
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Please select a valid image file');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!isStreaming ? (
        <div className="space-y-4">
          <Button onClick={startCamera} className="w-full" size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Start Live Camera
          </Button>
          
          <div className="text-center text-gray-500">or</div>
          
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline" 
            className="w-full" 
            size="lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Image from Gallery
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: '70vh' }}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            <Button onClick={captureImage} size="lg" className="bg-white text-black hover:bg-gray-100">
              <Square className="h-6 w-6 mr-2" />
              Capture
            </Button>
            <Button onClick={stopCamera} variant="outline" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Stop Camera
            </Button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      
      {!isStreaming && (
        <div className="text-sm text-gray-600 text-center space-y-1">
          <p>📱 Camera requires HTTPS in production</p>
          <p>🖼️ Use image upload as fallback option</p>
        </div>
      )}
    </div>
  );
}
