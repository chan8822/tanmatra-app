import { useState } from "react";
import { QrCode, X, Camera } from "lucide-react";

export function QRScanner() {
  const [open, setOpen] = useState(false);
  const [scanned, setScanned] = useState("");

  const simulateScan = () => {
    setScanned("Table-12");
    setTimeout(() => {
      setOpen(false);
      setScanned("");
      window.location.href = "#/menu";
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-3 bg-[#1a1c1c] border border-white/5 rounded-xl text-center"
      >
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-1.5 text-[#D4AF37]">
          <QrCode size={16} />
        </div>
        <span className="text-[10px] text-white/70">Scan QR</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6">
          <div className="bg-[#1a1c1c] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 p-1 text-white/40">
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold text-white mb-1">Scan Table QR</h3>
            <p className="text-xs text-white/50 mb-4">Point your camera at the table QR code</p>

            <div className="aspect-square bg-black rounded-xl border-2 border-[#D4AF37]/30 flex items-center justify-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={48} className="text-white/20" />
              </div>
              {/* Scanner frame */}
              <div className="absolute inset-4 border border-[#D4AF37]/50 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
              </div>
              {/* Scan line animation */}
              <div className="absolute left-4 right-4 h-0.5 bg-[#D4AF37] animate-[scan_2s_ease-in-out_infinite]" />
            </div>

            {scanned ? (
              <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm font-semibold text-green-400">{scanned}</p>
                <p className="text-[10px] text-white/50">Opening menu...</p>
              </div>
            ) : (
              <button onClick={simulateScan} className="w-full py-3 bg-[#D4AF37] text-[#0c0f0f] rounded-xl text-sm font-semibold">
                Simulate Scan (Table-12)
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
