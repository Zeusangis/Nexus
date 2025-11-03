"use client";

import type React from "react";

import { useState } from "react";
import {
  Upload,
  Video,
  CheckCircle2,
  Loader2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type AnalysisResult = {
  score_out_of_10: number;
  risk_level: string;
  avg_raw_score: number;
};

export default function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
        setStatus("idle");
        setAnalysisResult(null);
      } else {
        toast.error("Please upload a valid video file");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setFile(selectedFile);
      setStatus("idle");
      setAnalysisResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatus("idle");
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          setUploading(false);
          setAnalyzing(true);

          try {
            const result = JSON.parse(xhr.responseText);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            setAnalyzing(false);
            setStatus("success");
            toast.success("ACL Analysis complete!");
            setAnalysisResult(result);
          } catch {
            setAnalyzing(false);
            setStatus("error");
            toast.error("Failed to parse analysis results");
          }
        } else {
          setUploading(false);
          setAnalyzing(false);
          setStatus("error");
          toast.error(`Upload failed: ${xhr.statusText}`);
        }
      });

      xhr.addEventListener("error", () => {
        setStatus("error");
        toast.error("Network error occurred during upload");
        setUploading(false);
        setAnalyzing(false);
      });

      xhr.open("POST", "http://127.0.0.1:1010/analyze-acl");
      xhr.send(formData);
    } catch {
      setStatus("error");
      toast.error("An error occurred during upload");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleUploadAnother = () => {
    setFile(null);
    setStatus("idle");
    setAnalysisResult(null);
    setProgress(0);
    toast.info("Ready for new upload");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "moderate":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Video className="h-7 w-7 text-primary" />
            ACL Risk Analysis
          </CardTitle>
          <CardDescription>
            Upload your video to analyze ACL injury risk using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!analysisResult && (
            <>
              {/* File Input with Drag & Drop */}
              <div className="space-y-4">
                <label
                  htmlFor="video-upload"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-muted-foreground/25 bg-muted/50 hover:bg-muted/70 hover:border-muted-foreground/40"
                  } ${
                    uploading || analyzing
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload
                      className={`h-12 w-12 mb-4 transition-colors ${
                        dragActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <p className="mb-2 text-sm text-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV, AVI, WebM (MAX. 500MB)
                    </p>
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={uploading || analyzing}
                  />
                </label>

                {/* Selected File Info */}
                {file && !uploading && !analyzing && (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Uploading video...
                    </span>
                    <span className="font-bold text-primary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Analyzing State */}
              {analyzing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="relative h-20 w-20 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-10 w-10 text-primary/60" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-bold">Analyzing Video...</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Our AI is processing your video to assess ACL injury risk
                    </p>
                  </div>
                  <div className="w-full max-w-xs">
                    <Progress value={undefined} className="h-1.5" />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {!analyzing && (
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading {Math.round(progress)}%
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Analyze Video
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {analysisResult && status === "success" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center py-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Analysis Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Here are your ACL injury risk assessment results
                </p>
              </div>

              <div className="space-y-4">
                {/* Main Score Card */}
                <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-xl border-2 border-primary/20 text-center space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    ACL Risk Score
                  </p>
                  <p className="text-6xl font-bold text-primary">
                    {analysisResult.score_out_of_10}
                    <span className="text-3xl text-muted-foreground">/10</span>
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-5 rounded-xl border-2 ${getRiskColor(
                      analysisResult.risk_level
                    )}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                        Risk Level
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {analysisResult.risk_level}
                    </p>
                  </div>
                  <div className="p-5 bg-muted/50 rounded-xl border-2 border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Raw Score
                    </p>
                    <p className="text-2xl font-bold">
                      {analysisResult.avg_raw_score.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUploadAnother}
                variant="outline"
                className="w-full h-12 text-base font-semibold bg-transparent"
                size="lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Analyze Another Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
