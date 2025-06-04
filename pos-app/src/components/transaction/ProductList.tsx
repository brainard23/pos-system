import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Category Tabs */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start">
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const isSelected = selectedProducts.some(p => p._id === product._id);
                return (
                  <Button
                    key={product._id}
                    variant="outline"
                    className={cn(
                      "h-auto p-4 flex flex-col items-start text-left space-y-2",
                      isSelected && "border-primary bg-primary/5"
                    )}
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </div>
                    <div className="text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {product.stock} {product.unit}
                    </div>
                  </Button>
                );
              })}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 