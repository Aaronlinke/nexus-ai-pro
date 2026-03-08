import { useState, useRef, useCallback, useEffect } from "react";
import { Radio, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  onRecorded: (base64: string, durationSec: number) => void;
}

const AudioRecorder = ({ onRecorded }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          onRecorded(base64, duration);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.");
    }
  }, [duration, onRecorded]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-1">
      {recording && (
        <span className="text-[10px] text-destructive font-mono animate-pulse tabular-nums">
          🔴 {formatTime(duration)}
        </span>
      )}
      <Button
        type="button"
        size="icon"
        onClick={recording ? stopRecording : startRecording}
        className={`h-10 w-10 md:h-12 md:w-12 shrink-0 transition-all duration-300 ${
          recording
            ? "bg-destructive/20 border border-destructive text-destructive animate-pulse"
            : "bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30"
        }`}
        title={recording ? "Aufnahme stoppen" : "Umgebung aufnehmen (Audio)"}
      >
        {recording ? (
          <Square className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <Radio className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </Button>
    </div>
  );
};

export default AudioRecorder;
