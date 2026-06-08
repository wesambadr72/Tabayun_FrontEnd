"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export function Toast({ message, type = "success", duration = 3000, onClose, isVisible }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const backgrounds = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl min-w-[320px] max-w-[90vw]",
        backgrounds[type],
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-[#2C160F] font-bold text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors text-[#2C160F]/30"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Hook for using toast
export function useToast() {
  const [state, setState] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setState({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setState((prev) => ({ ...prev, isVisible: false }));
  };

  return { ...state, showToast, hideToast };
}