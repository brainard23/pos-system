import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarcodeScanner } from './BarcodeScanner';
import toast from 'react-hot-toast';

interface ProductListProps {
  onSelectProduct: (product: Product) => void;
  selectedProducts: Product[];
}

export function ProductList({ onSelectProduct, selectedProducts }: ProductListProps) {
  const { products, isLoading, searchQuery, setSearchQuery } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category.name));
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleBarcodeScan = useCallback((barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      onSelectProduct(product);
    } else {
      toast.error('No product found with this barcode');
    }
  }, [products, onSelectProduct]);

  return (
    <Card className="shadow-lg border-gray-300">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search, Barcode Scanner, and Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <BarcodeScanner onScan={handleBarcodeScan} />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start">
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize mr-1"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-md h-[500px] flex flex-col shadow-lg border-gray-300">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm border-b">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Barcode</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">Category</div>
              </div>

              {/* Scrollable Items */}
              <div className="flex-1 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No products found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredProducts.map(product => {
                      const isSelected = selectedProducts.some(p => p._id === product._id);
                      return (
                        <div
                          key={product._id}
                          className={cn(
                            "grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 cursor-pointer",
                            isSelected && "bg-primary/5", product.stock === 0 && "pointer-events-none text-red-500"
                          )}
                          onClick={() => onSelectProduct(product)}
                    
                        >
                          <div className="col-span-4 font-medium truncate">{product.name}</div>
                          <div className="col-span-2 text-sm text-muted-foreground truncate">{product.barcode}</div>
                          <div className="col-span-2 font-medium">${product.price.toFixed(2)}</div>
                          <div className="col-span-2 text-sm text-muted-foreground">
                            {product.stock} {product.unit}
                          </div>
                          <div className="col-span-2 text-sm text-muted-foreground capitalize">
                            {product.category.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 