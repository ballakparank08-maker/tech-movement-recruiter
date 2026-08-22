import React, { useState, useRef, useEffect } from 'react';
import { Video, Camera, StopCircle, RefreshCw, Upload, Link2, CheckCircle2, Play, AlertCircle, Sparkles } from 'lucide-react';

interface VideoIntroductionRecorderProps {
  onVideoSelected: (videoData: { type: 'recorded' | 'file' | 'url'; dataUrl?: string; url?: string }) => void;
  existingVideo?: { type: 'recorded' | 'file' | 'url'; dataUrl?: string; url?: string };
}

export const VideoIntroductionRecorder: React.FC<VideoIntroductionRecorderProps> = ({
  onVideoSelected,
  existingVideo
}) => {
  const [mode, setMode] = useState<'record' | 'upload' | 'url'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(existingVideo?.dataUrl || null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState(existingVideo?.url || '');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera / Microphone access was blocked or not found. You can also upload a video file or paste a video link.');
      setIsCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    chunksRef.current = [];
    setRecordedBlobUrl(null);
    setRecordingTime(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : 'video/webm';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        stopCameraStream();

        // Convert to base64 for persistent storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onVideoSelected({ type: 'recorded', dataUrl: base64data });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(500);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording initialization error:', err);
      setCameraError('Unable to start recording on this browser. Try uploading a video file.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    setRecordedBlobUrl(null);
    setRecordingTime(0);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Video file size exceeds 25MB. Please upload a smaller video or paste a Loom/Drive link.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setRecordedBlobUrl(dataUrl);
      onVideoSelected({ type: 'file', dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = () => {
    if (!videoUrlInput.trim()) return;
    onVideoSelected({ type: 'url', url: videoUrlInput.trim() });
  };

  return (
    <div className="bg-[#070C1E]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-5 relative overflow-hidden" id="video-intro-section">
      {/* Decorative subtle border glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#004E89]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#004E89]/30 to-[#FF6B35]/20 border border-white/10 flex items-center justify-center text-[#FF7F4E]">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              1-Minute Video Introduction <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30">Recommended</span>
            </h4>
            <p className="text-xs text-slate-400">Introduce yourself and what excites you about Tech Movement</p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#050B1D] p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => { setMode('record'); stopCameraStream(); }}
            className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
              mode === 'record' ? 'bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 inline mr-1" />
            Live Record
          </button>
          <button
            type="button"
            onClick={() => { setMode('upload'); stopCameraStream(); }}
            className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
              mode === 'upload' ? 'bg-[#004E89]/30 text-[#7DD3FC] border border-[#004E89]/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => { setMode('url'); stopCameraStream(); }}
            className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
              mode === 'url' ? 'bg-[#F7C59F]/20 text-[#F7C59F] border border-[#F7C59F]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 inline mr-1" />
            Link URL
          </button>
        </div>
      </div>

      {/* Mode 1: Live In-Browser Webcam Recording */}
      {mode === 'record' && (
        <div className="space-y-3">
          {recordedBlobUrl ? (
            /* Playback state */
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-emerald-500/40 bg-black aspect-video max-h-64 flex items-center justify-center">
                <video src={recordedBlobUrl} controls className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-2 py-0.5 rounded text-xs flex items-center gap-1 backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3" /> Ready to Submit
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F7C59F]" /> Video attached to your application
                </span>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Retake Video
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Viewfinder or Standby */
            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#050B1D] aspect-video max-h-64 flex flex-col items-center justify-center text-center p-4">
              {isCameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />

                  {/* Top Recording HUD */}
                  {isRecording && (
                    <div className="absolute top-3 left-3 bg-red-950/90 border border-red-500/60 text-red-400 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 backdrop-blur-md animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      REC {Math.floor(recordingTime / 60)}:{('0' + (recordingTime % 60)).slice(-2)} / 01:00
                    </div>
                  )}

                  {/* Controls overlay */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-semibold text-xs shadow-lg shadow-[#FF6B35]/25 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white" /> Start Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2 animate-bounce cursor-pointer"
                      >
                        <StopCircle className="w-4 h-4" /> Stop & Finish
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#004E89]/25 border border-[#004E89]/40 flex items-center justify-center text-[#38BDF8] mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Record a brief 30–60 second intro</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">Share your core strengths, past projects, and why Tech Movement aligns with your goals.</p>
                  </div>
                  {cameraError && (
                    <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2 rounded-md flex items-center gap-2 max-w-sm mx-auto">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-lg bg-[#004E89]/30 hover:bg-[#004E89]/40 border border-[#004E89]/50 text-[#7DD3FC] text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,78,137,0.3)] cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> Enable Camera & Mic
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Video File Upload */}
      {mode === 'upload' && (
        <div className="border-2 border-dashed border-white/10 hover:border-[#FF6B35]/50 rounded-xl p-6 text-center bg-[#050B1D] transition-colors">
          <input
            type="file"
            id="video-file-upload-input"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="video-file-upload-input" className="cursor-pointer block space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] flex items-center justify-center mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-slate-200">
              {uploadedFileName ? (
                <span className="text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {uploadedFileName}
                </span>
              ) : (
                <>Click to select a video file or drag & drop</>
              )}
            </div>
            <p className="text-[11px] text-slate-400">MP4, WebM or MOV (Max 25MB)</p>
          </label>
        </div>
      )}

      {/* Mode 3: Video Link / Loom / YouTube */}
      {mode === 'url' && (
        <div className="space-y-3 bg-[#050B1D] p-4 rounded-lg border border-white/10">
          <label className="block text-xs font-medium text-slate-300">
            Paste Loom, YouTube, Google Drive, or Vimeo Video URL:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://www.loom.com/share/..."
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              onBlur={handleUrlSave}
              className="flex-1 bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleUrlSave}
              className="px-3 py-2 rounded-lg bg-[#F7C59F]/20 hover:bg-[#F7C59F]/30 border border-[#F7C59F]/40 text-[#F7C59F] text-xs font-medium transition-colors cursor-pointer"
            >
              Attach
            </button>
          </div>
          {videoUrlInput && (
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Attached: {videoUrlInput}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
