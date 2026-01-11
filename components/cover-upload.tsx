"use client";

import { useState, useEffect } from "react";
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  CloudUpload,
  ImageIcon,
  TriangleAlert,
  Upload,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverUploadProps {
  maxSize?: number;
  accept?: string;
  className?: string;
  onImageChange?: (file: File | null) => void;
}

export default function CoverUpload({
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  className,
  onImageChange,
}: CoverUploadProps) {
  // Iniciamos en null para evitar colisiones de estado en el primer render
  const [coverImage, setCoverImage] = useState<FileWithPreview | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (onImageChange) {
      onImageChange(coverImage?.file as File | null);
    }
  }, [coverImage, onImageChange]);

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesChange: (files) => {
      if (files.length > 0) {
        setImageLoading(true);
        setIsUploading(true);
        setUploadProgress(0);
        setUploadError(null);
        setCoverImage(files[0]);
        simulateUpload();
      }
    },
  });

  const simulateUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (Math.random() < 0.05) {
            setUploadError("Error al subir. Por favor, inténtalo de nuevo.");
            return 0;
          }
          return 100;
        }
        return Math.min(prev + (Math.random() * 15 + 5), 100);
      });
    }, 200);
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setImageLoading(false);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  const retryUpload = () => {
    if (coverImage) {
      setUploadError(null);
      setIsUploading(true);
      setUploadProgress(0);
      simulateUpload();
    }
  };

  const hasImage = coverImage && coverImage.preview;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl transition-all duration-200 border border-border",
          isDragging
            ? "border-dashed border-primary bg-primary/5"
            : hasImage
            ? "border-border bg-background hover:border-primary/50"
            : "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        {hasImage ? (
          <div className="relative aspect-21/9 w-full">
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-5" />
                  <span className="text-sm">Cargando imagen...</span>
                </div>
              </div>
            )}
            <Image
              src={coverImage.preview as string}
              alt="Portada"
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              width={1200}
              height={514}
              onLoad={() => setImageLoading(false)}
            />

            {/* Overlay de acciones */}
            <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  type="button" // Evita submit
                  onClick={openFileDialog}
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-gray-900 hover:bg-white"
                >
                  <Upload className="mr-2 size-4" />
                  Cambiar
                </Button>
                <Button
                  type="button" // Evita submit
                  onClick={removeCoverImage}
                  variant="destructive"
                  size="sm"
                >
                  <XIcon className="mr-2 size-4" />
                  Eliminar
                </Button>
              </div>
            </div>

            {/* Progreso de carga */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="relative size-16">
                  <svg className="size-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/20"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 * (1 - uploadProgress / 100)}
                      className="text-white transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex aspect-21/9 w-full cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center"
            onClick={openFileDialog}
          >
            <div className="rounded-full bg-primary/10 p-4">
              <CloudUpload className="size-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Subir imagen de portada</h3>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta aquí, o haz clic para buscar
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <ImageIcon className="mr-2 size-4" />
              Explorar archivos
            </Button>
          </div>
        )}
      </div>

      {/* Alertas de error */}
      {(errors.length > 0 || uploadError) && (
        <Alert variant="destructive" className="mt-4">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Error en la imagen</AlertTitle>
            <AlertDescription>
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
              {uploadError && (
                <div className="mt-2">
                  <p className="mb-2">{uploadError}</p>
                  <Button
                    type="button"
                    onClick={retryUpload}
                    size="sm"
                    variant="outline"
                  >
                    Reintentar
                  </Button>
                </div>
              )}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
