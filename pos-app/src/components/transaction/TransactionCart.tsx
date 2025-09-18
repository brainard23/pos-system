import { useState } from 'react';
import { TransactionItem, PaymentMethod } from '@/types/transaction';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionCartProps {
  items: TransactionItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyDiscount: (code: string) => Promise<void>;
  onCompleteTransaction: (paymentMethod: PaymentMethod) => Promise<void>;
  isLoading: boolean;
  discountCode?: string;
  onDiscountCodeChange: (code: string) => void;
}

export function TransactionCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onApplyDiscount,
  onCompleteTransaction,
  isLoading,
  discountCode,
  onDiscountCodeChange,
}: TransactionCartProps) {
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'gcash' | 'credit_card'>('cash');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = 0; // This will be calculated based on the applied discount
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    try {
      setIsApplyingDiscount(true);
      await onApplyDiscount(discountCode);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleCompleteTransaction = async () => {
    if (items.length === 0) return;
    await onCompleteTransaction(selectedPayment as PaymentMethod);
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-gray-300">
      <CardHeader>
        <CardTitle>Transaction Cart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Cart Items */}
        <div className="border rounded-md h-[300px] flex flex-col shadow-lg border-gray-300">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm border-b">
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-4">Quantity</div>
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-1"></div>
          </div>

          {/* Scrollable Items */}
          <ScrollArea className="flex-1">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No items in cart
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.product._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-3 font-medium">{item.product.name}</div>
                    <div className="col-span-2">${item.price.toFixed(2)}</div>
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          // variant="outline"
                          // size="icon"
                          // className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                    
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2">${item.subtotal.toFixed(2)}</div>
                    <div className="col-span-1">
                      <Button
                        // variant="ghost"
                        // size="icon"
                        onClick={() => onRemoveItem(item.product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Discount Code */}
        <div className="space-y-2 ">
          <Label htmlFor="discount">Discount Code</Label>
          <div className="flex space-x-2">
            <Input
              id="discount"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => onDiscountCodeChange(e.target.value)}
              className='shadow-lg border-gray-300'
            />
            <Button
              onClick={handleApplyDiscount}
              disabled={!discountCode || isApplyingDiscount}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Payment Method (text-only, highlight selected) */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'cash', label: 'Cash' },
              { key: 'gcash', label: 'Gcash' },
              { key: 'credit_card', label: 'Credit Card' },
            ] as const).map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedPayment(opt.key)}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm transition',
                  selectedPayment === opt.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Selected payment method will be used for the transaction.</div>
        </div>
      </CardContent>
      <CardFooter className="space-y-4 border-t pt-4">
        <div className="space-y-2 w-full pr-6">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCompleteTransaction}
          disabled={items.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : 'Complete Transaction'}
        </Button>
      </CardFooter>
    </Card>
  );
} 