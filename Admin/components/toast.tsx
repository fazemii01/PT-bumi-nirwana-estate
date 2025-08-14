"use client";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";

let toastRef: Toast | null = null;

export function ToastGlobal() {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    toastRef = toast.current;
  }, []);

  return <Toast ref={toast} />;
}

export function showToastSuccess(message: string) {
  toastRef?.show({
    severity: "success",
    summary: "Success",
    detail: message,
  });
}

export function showToastError(message: string) {
  toastRef?.show({
    severity: "error",
    summary: "Error",
    detail: message,
  });
}
