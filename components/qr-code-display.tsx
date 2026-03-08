"use client";

import { Check, ChevronDown, Copy, Download } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface QRCodeDisplayProps {
  payload: string;
}

export function QRCodeDisplay({ payload }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    // This only runs on the client
    qrCodeInstance.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "svg",
      data: payload,
      dotsOptions: {
        color: "#e2583e",
        type: "rounded",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#e2583e",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#e2583e",
      },
    });

    if (qrRef.current) {
      qrCodeInstance.current.append(qrRef.current);
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
      }
    };
  }, [payload]);

  // Update QR code when payload changes
  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: payload,
      });
    }
  }, [payload]);

  const handleDownload = (ext: "svg" | "png" | "jpeg" | "webp") => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ name: "snap-qr", extension: ext });
      toast.info(`Download iniciado em formato ${ext.toUpperCase()}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    toast.success("Payload copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#e2583e] to-orange-400 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
        <div className="bg-white dark:bg-zinc-950 rounded-[40px] p-8 relative shadow-2xl border border-white/50 dark:border-zinc-800">
          <div ref={qrRef} className="w-[300px] h-[300px] flex items-center justify-center overflow-hidden" />
        </div>
      </div>

      <div className="w-full max-w-sm mt-12 space-y-4">
        <div className="flex items-stretch h-12">
          <Button
            onClick={() => handleDownload("svg")}
            className="flex-1 h-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold uppercase text-xs tracking-widest gap-2 rounded-l-lg rounded-r-none border-0 border-r-2 border-zinc-700 dark:border-zinc-600"
          >
            <Download className="size-4" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-full w-10 px-0 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-l-none rounded-r-lg border-0">
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white dark:bg-zinc-900">
              <DropdownMenuItem onClick={() => handleDownload("svg")} className="cursor-pointer text-xs font-bold uppercase">
                SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("png")} className="cursor-pointer text-xs font-bold uppercase">
                PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("jpeg")} className="cursor-pointer text-xs font-bold uppercase">
                JPEG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("webp")} className="cursor-pointer text-xs font-bold uppercase">
                WEBP
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Visualização do Payload */}
        <div className="space-y-2">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Conteúdo Codificado</span>
          <div className="flex gap-2">
            <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 overflow-hidden">
              <code className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono break-all line-clamp-2">{payload}</code>
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="shrink-0 h-auto px-3 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              title="Copiar payload"
            >
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
