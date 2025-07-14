import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Download,
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import React, { useState } from "react";

export const ImageViewerDialog = ({
  dataHash,
  children,
  recordType,
}: {
  dataHash: string;
  children: React.ReactNode;
  recordType?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getImageUrl = (dataHash: string) => {
    const storedCid = localStorage.getItem(`cid:${dataHash}`);
    const ipfsCid = storedCid || dataHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;
  };

  const handleDownload = async () => {
    try {
      const imageUrl = getImageUrl(dataHash);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `health-record-${dataHash.slice(0, 8)}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    },
    [isFullscreen]
  );

  const handleMinimize = React.useCallback(() => {
    setIsFullscreen(false);
  }, []);

  React.useEffect(() => {
    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullscreen, handleKeyDown]);

  const imageUrl = getImageUrl(dataHash);

  return (
    <>
      <Dialog open={isOpen && !isFullscreen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] sm:w-full p-0 gap-0 transition-all duration-300 [&>button]:hidden">
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Health Record - {recordType || "Document"}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(imageUrl, "_blank")}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden p-4">
            <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Loading image...
                    </p>
                  </div>
                </div>
              )}

              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="flex flex-col items-center gap-3 text-center p-6">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <div>
                      <h3 className="font-medium mb-2">Failed to load image</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The image could not be loaded from IPFS. This might be
                        due to network issues or the file being unavailable.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(imageUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Try opening in new tab
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <img
                src={imageUrl}
                alt={`Health record ${recordType || "document"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`
                  w-full h-full object-contain rounded-lg
                  ${imageLoading ? "opacity-0" : "opacity-100"}
                  ${imageError ? "hidden" : "block"}
                  transition-opacity duration-300
                `}
                style={{
                  maxHeight: "calc(90vh - 120px)",
                }}
              />
            </div>
          </div>

          <div className="p-4 pt-2 border-t bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">Hash:</span>
                <code className="bg-muted px-2 py-1 rounded font-mono">
                  {dataHash.slice(0, 24)}...
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Source:</span>
                <span>IPFS Gateway</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isFullscreen && isOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <div className="absolute top-4 right-4 z-[101] flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white"
              type="button"
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white"
              type="button"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(imageUrl, "_blank")}
              className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white"
              type="button"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                  <p className="text-sm text-white">Loading image...</p>
                </div>
              </div>
            )}

            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <div>
                    <h3 className="font-medium mb-2 text-white">
                      Failed to load image
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      The image could not be loaded from IPFS. This might be due
                      to network issues or the file being unavailable.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(imageUrl, "_blank")}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Try opening in new tab
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <img
              src={imageUrl}
              alt={`Health record ${recordType || "document"}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`
                max-w-full max-h-full object-contain
                ${imageLoading ? "opacity-0" : "opacity-100"}
                ${imageError ? "hidden" : "block"}
                transition-opacity duration-300
              `}
              onClick={handleMinimize}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-[101]">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <div className="flex flex-col sm:flex-row gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hash:</span>
                  <code className="bg-white/10 px-2 py-1 rounded font-mono">
                    {dataHash.slice(0, 24)}...
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Source:</span>
                  <span>IPFS Gateway</span>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <span className="text-gray-400">
                    Press ESC to exit fullscreen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
