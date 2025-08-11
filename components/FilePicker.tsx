'use client';
import { useRef } from 'react';

export default function FilePicker({ label, name, accept="image/*" }: { label: string; name: string; accept?: string; }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-80">{label}</label>
      <div className="flex gap-3 items-center">
        <input ref={ref} type="file" name={name} accept={accept} className="hidden"/>
        <button type="button" className="btn" onClick={() => ref.current?.click()}>Välj bild</button>
        <span className="text-xs opacity-70">PNG/JPG</span>
      </div>
    </div>
  );
}
