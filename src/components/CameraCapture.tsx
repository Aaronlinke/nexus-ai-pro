import { useState, useRef, useCallback } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setError(null);
    } catch {
      setError("Kamera-Zugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setPhoto(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const retake = useCallback(() => {
    setPhoto(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (photo) {
      onCapture(photo);
      onClose();
    }
  }, [photo, onCapture, onClose]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neon">📷 Kamera</h3>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative bg-secondary rounded-lg overflow-hidden aspect-video flex items-center justify-center border border-neon/30">
          {error && <p className="text-destructive text-xs text-center px-4">{error}</p>}

          {!cameraActive && !photo && !error && (
            <Button onClick={startCamera} className="bg-neon/20 border border-neon text-neon hover:bg-neon/30">
              <Camera className="h-5 w-5 mr-2" /> Kamera starten
            </Button>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive && !photo ? "" : "hidden"}`}
          />

          {photo && (
            <img src={photo} alt="Captured" className="w-full h-full object-cover" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-center gap-3">
          {cameraActive && !photo && (
            <Button onClick={takePhoto} className="bg-neon/20 border border-neon text-neon hover:bg-neon/30">
              <Camera className="h-4 w-4 mr-2" /> Foto aufnehmen
            </Button>
          )}
          {photo && (
            <>
              <Button onClick={retake} variant="outline" className="border-neon/30 text-muted-foreground">
                <RotateCcw className="h-4 w-4 mr-2" /> Nochmal
              </Button>
              <Button onClick={confirmPhoto} className="bg-neon/20 border border-neon text-neon hover:bg-neon/30">
                <Check className="h-4 w-4 mr-2" /> An KI senden
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
