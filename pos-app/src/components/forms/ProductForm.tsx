import { FormEvent, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { NewProduct } from '../../types/product';
import { Category, Supplier } from '../../types/product';

interface ProductFormProps {
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (product: NewProduct) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  initialData?: Partial<NewProduct>;
}

export function ProductForm({ 
  categories, 
  suppliers, 
  onSubmit, 
  isLoading, 
  onCancel,
  initialData 
}: ProductFormProps) {
  const [product, setProduct] = useState<Omit<NewProduct, 'barcode'> & { barcode?: string }>({
    name: '',
    description: '',
    sku: '',
    category: '',
    price: '',
    cost: 0,
    stock: '',
    minStock: '',
    supplier: '',
    unit: 'piece',
    ...initialData,
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setProduct(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only include barcode if it has a value
    const productToSubmit: NewProduct = {
      ...product,
      barcode: product.barcode?.trim() || undefined,
    };
    await onSubmit(productToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode (Optional)</Label>
        <Input
          id="barcode"
          value={product.barcode || ''}
          onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
          placeholder="Enter barcode if available"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={product.category}
            onValueChange={(value) => setProduct({ ...product, category: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Select
            value={product.supplier}
            onValueChange={(value) => setProduct({ ...product, supplier: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={product.cost}
            onChange={(e) => setProduct({ ...product, cost: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Minimum Stock</Label>
          <Input
            id="minStock"
            type="number"
            value={product.minStock}
            onChange={(e) => setProduct({ ...product, minStock: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select
          value={product.unit}
          onValueChange={(value) => setProduct({ ...product, unit: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="piece">Piece</SelectItem>
            <SelectItem value="kg">Kilogram</SelectItem>
            <SelectItem value="g">Gram</SelectItem>
            <SelectItem value="l">Liter</SelectItem>
            <SelectItem value="ml">Milliliter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
} 