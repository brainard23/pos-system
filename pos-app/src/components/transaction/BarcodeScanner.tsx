import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BarcodeScanner as ReactBarcodeScanner, DetectedBarcode } from 'react-barcode-scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import 'react-barcode-scanner/polyfill';
import toast from 'react-hot-toast';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'usb'>('camera');
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(0);
  const SCAN_TIMEOUT = 50; // Time in ms to consider input as part of the same scan

  // Initialize the scanner
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScannerReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle USB barcode scanner input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // Reset buffer if too much time has passed since last key
      if (currentTime - lastKeyTime.current > SCAN_TIMEOUT) {
        barcodeBuffer.current = '';
      }
      
      lastKeyTime.current = currentTime;

      // Handle different key inputs
      if (e.key === 'Enter') {
        if (barcodeBuffer.current) {
          onScan(barcodeBuffer.current);
          barcodeBuffer.current = '';
          toast.success('Barcode scanned successfully');
        }
      } else if (e.key === 'Backspace') {
        // Some scanners send backspace to clear input
        barcodeBuffer.current = '';
      } else if (e.key.length === 1) {
        // Only add printable characters
        barcodeBuffer.current += e.key;
      }
    };

    // Only add event listener when USB scanner tab is active
    if (activeTab === 'usb') {
      window.addEventListener('keydown', handleKeyDown);
      // Focus the input field when USB scanner tab is active
      const input = document.querySelector('input[placeholder="Scan or enter barcode..."]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, onScan]);

  const handleManualInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualBarcode(e.target.value);
  }, []);

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode) {
      onScan(manualBarcode);
      setManualBarcode('');
      toast.success('Barcode entered successfully');
    }
  }, [manualBarcode, onScan]);

  const handleScan = useCallback((barcodes: DetectedBarcode[]) => {
    console.log('Scanned barcodes:', barcodes);
    if (barcodes.length > 0) {
      onScan(barcodes[0].rawValue);
      setIsOpen(false);
      toast.success('Barcode scanned successfully');
    }
  }, [onScan]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Barcode scanner error:', event);
    toast.error('Failed to initialize camera scanner');
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <form onSubmit={handleManualSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Scan or enter barcode..."
          value={manualBarcode}
          onChange={handleManualInput}
          className="w-48"
          autoComplete="off"
        />
      </form>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button title="Scan barcode">
            <Camera className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'camera' | 'usb')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera">
                <Camera className="h-4 w-4 mr-2" />
                Camera Scanner
              </TabsTrigger>
              <TabsTrigger value="usb">
                <Keyboard className="h-4 w-4 mr-2" />
                USB Scanner
              </TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-4">
              <div className="relative w-full aspect-video bg-black">
                {isScannerReady ? (
                  <ReactBarcodeScanner
                    onCapture={handleScan}
                    onError={handleError}
                    options={{
                      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128']
                    }}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Initializing scanner...
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-primary animate-pulse" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="usb" className="mt-4">
              <div className="p-4 space-y-4">
                <div className="text-center text-muted-foreground">
                  <p>Connect your USB barcode scanner and scan a barcode.</p>
                  <p className="text-sm mt-2">The scanner will be automatically detected when you scan.</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    <Keyboard className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 