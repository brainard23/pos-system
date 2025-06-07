import { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { ProductList } from '@/components/transaction/ProductList';
import { TransactionCart } from '@/components/transaction/TransactionCart';
import { Product } from '@/types/product';
import { TransactionItem, PaymentMethod } from '@/types/transaction';
import { useTransactions } from '@/hooks/useTransactions';
import toast from 'react-hot-toast';

export default function TransactionPage() {
  const [cartItems, setCartItems] = useState<TransactionItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const { isLoading, addTransaction, applyDiscount } = useTransactions();

  const handleSelectProduct = useCallback((product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product._id === product._id);
      if (existingItem) {
        return prev.map(item =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
        },
      ];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
          : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
  }, []);

  const handleApplyDiscount = useCallback(async (code: string) => {
    try {
      await applyDiscount(code);
      toast.success('Discount applied successfully');
    } catch (error) {
      toast.error('Failed to apply discount');
    }
  }, [applyDiscount]);

  const handleCompleteTransaction = useCallback(async (paymentMethod: PaymentMethod) => {
    try {
      await addTransaction({
        items: cartItems.map(({ product, quantity, price }) => ({
          product: product._id,
          quantity,
          price,
        })),
        paymentMethod,
        discountCode: discountCode || undefined,
      });
      setCartItems([]);
      setDiscountCode('');
    } catch (error) {
      toast.error('Failed to complete transaction');
    }
  }, [addTransaction, cartItems, discountCode]);

  return (
      <div className="p-4" style={{ height: '100dvh'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Products Section */}
          <div className="h-full">
            <ProductList
              onSelectProduct={handleSelectProduct}
              selectedProducts={cartItems.map(item => item.product)}
            />
          </div>

          {/* Transaction Cart Section */}
          <div className="">
            <TransactionCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onApplyDiscount={handleApplyDiscount}
              onCompleteTransaction={handleCompleteTransaction}
              isLoading={isLoading}
              discountCode={discountCode}
              onDiscountCodeChange={setDiscountCode}
            />
          </div>
        </div>
      </div>
  );
}
