import { useState } from 'react';
import { Product } from '@/types/product';
import { TransactionItem, PaymentMethod } from '@/types/transaction';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Minus, Plus, Trash2, CreditCard, Banknote, Receipt } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
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
    await onCompleteTransaction(paymentMethod);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Transaction Cart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Cart Items */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product._id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Discount Code */}
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Code</Label>
          <div className="flex space-x-2">
            <Input
              id="discount"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => onDiscountCodeChange(e.target.value)}
            />
            <Button
              onClick={handleApplyDiscount}
              disabled={!discountCode || isApplyingDiscount}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="cash"
                id="cash"
                className="peer sr-only"
              />
              <Label
                htmlFor="cash"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Banknote className="mb-3 h-6 w-6" />
                Cash
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="credit_card"
                id="credit_card"
                className="peer sr-only"
              />
              <Label
                htmlFor="credit_card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                Credit Card
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="visa"
                id="visa"
                className="peer sr-only"
              />
              <Label
                htmlFor="visa"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Receipt className="mb-3 h-6 w-6" />
                Visa
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="space-y-4 border-t pt-4">
        <div className="space-y-2 w-full">
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