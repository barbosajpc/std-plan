import { useState, useCallback } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useConteudoStore } from '@/store/useConteudoStore';
import { X, Upload, FileJson, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImportModal() {
  const open = useUIStore(s => s.importModalOpen);
  const setOpen = useUIStore(s => s.setImportModalOpen);
  const setConteudoData = useConteudoStore(s => s.setConteudoData);

  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = useCallback(async (file: File) => {
    setError('');
    setFileName(file.name);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate structure
      if (!data.concurso || !data.conhecimentos || !Array.isArray(data.conhecimentos)) {
        setError('Estrutura inválida. O JSON deve conter "concurso" e "conhecimentos".');
        return;
      }

      for (const c of data.conhecimentos) {
        if (!c.id || !c.tipo || !Array.isArray(c.areas)) {
          setError('Cada conhecimento deve ter "id", "tipo" e "areas".');
          return;
        }
      }

      if (confirm('Substituir o conteúdo atual? (Eventos agendados não serão apagados)')) {
        setConteudoData(data);
        setOpen(false);
      }
    } catch {
      setError('Arquivo JSON inválido.');
    }
  }, [setConteudoData, setOpen]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()} className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Importar Conteúdo</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <FileJson className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Arraste seu <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">conteudo.json</code> aqui
          </p>
          <label className="cursor-pointer">
            <span className="text-xs text-primary hover:underline">ou clique para selecionar</span>
            <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
          </label>
          {fileName && (
            <p className="text-xs text-foreground mt-2">{fileName}</p>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
