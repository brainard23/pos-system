import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Layout from './Layout';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { Plus, Building2, Tag, Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: {
    _id: string;
    name: string;
    description: string;
  };
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  unit: string;
  isActive: boolean;
}

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  parent?: string;
  isActive: boolean;
}

interface NewSupplier {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

interface NewCategory {
  name: string;
  description: string;
  parent?: string;
}

interface NewProduct {
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: string;
  price: string;
  cost: number;
  stock: string;
  minStock: string;
  supplier: string;
  unit: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: '',
    price: '',
    cost: 0,
    stock: '',
    minStock: '',
    supplier: '',
    unit: 'piece',
  });

  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    description: '',
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/products?page=${currentPage}&search=${searchQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch suppliers');
      }

      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch suppliers');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchCategories();
  }, [currentPage, searchQuery]);

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingProduct(true);

    const ourPrice = (parseFloat(newProduct.price) * newProduct.cost) + parseFloat(newProduct.price);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: ourPrice,
          cost: newProduct.cost,
          stock: parseInt(newProduct.stock),
          minStock: parseInt(newProduct.minStock),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      toast.success('Product added successfully');
      setIsDialogOpen(false);
      setNewProduct({
        name: '',
        description: '',
        sku: '',
        barcode: '',
        category: '',
        price: '',
        cost: 0,
        stock: '',
        minStock: '',
        supplier: '',
        unit: 'piece',
      });
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleAddSupplier = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingSupplier(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add supplier');
      }

      toast.success('Supplier added successfully');
      setIsSupplierDialogOpen(false);
      setNewSupplier({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      });
      fetchSuppliers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add supplier');
    } finally {
      setIsAddingSupplier(false);
    }
  };

  const handleAddCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingCategory(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add category');
      }

      toast.success('Category added successfully');
      setIsCategoryDialogOpen(false);
      setNewCategory({
        name: '',
        description: '',
      });
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSupplier} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierName">Name</Label>
                    <Input
                      id="supplierName"
                      value={newSupplier.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewSupplier({ ...newSupplier, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierEmail">Email</Label>
                    <Input
                      id="supplierEmail"
                      type="email"
                      value={newSupplier.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewSupplier({ ...newSupplier, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierPhone">Phone</Label>
                    <Input
                      id="supplierPhone"
                      value={newSupplier.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewSupplier({ ...newSupplier, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierStreet">Street Address</Label>
                    <Input
                      id="supplierStreet"
                      value={newSupplier.address.street}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewSupplier({
                          ...newSupplier,
                          address: { ...newSupplier.address, street: e.target.value }
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierCity">City</Label>
                      <Input
                        id="supplierCity"
                        value={newSupplier.address.city}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewSupplier({
                            ...newSupplier,
                            address: { ...newSupplier.address, city: e.target.value }
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierState">State</Label>
                      <Input
                        id="supplierState"
                        value={newSupplier.address.state}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewSupplier({
                            ...newSupplier,
                            address: { ...newSupplier.address, state: e.target.value }
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierCountry">Country</Label>
                      <Input
                        id="supplierCountry"
                        value={newSupplier.address.country}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewSupplier({
                            ...newSupplier,
                            address: { ...newSupplier.address, country: e.target.value }
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierZipCode">ZIP Code</Label>
                      <Input
                        id="supplierZipCode"
                        value={newSupplier.address.zipCode}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewSupplier({
                            ...newSupplier,
                            address: { ...newSupplier.address, zipCode: e.target.value }
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingSupplier}>
                      {isAddingSupplier ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Supplier'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Input
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewCategory({ ...newCategory, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryParent">Parent Category (Optional)</Label>
                    <Select
                      value={newCategory.parent}
                      onValueChange={(value) =>
                        setNewCategory({ ...newCategory, parent: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
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
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingCategory}>
                      {isAddingCategory ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Category'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode (Optional)</Label>
                    <Input
                      id="barcode"
                      value={newProduct.barcode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewProduct({ ...newProduct, barcode: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">SRP</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.price}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Markup (%)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        min="0"
                        max='100'
                        value={newProduct.cost * 100}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, cost:  parseFloat(e.target.value)/100 })
                        }
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
                        min="0"
                        value={newProduct.stock}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        type="number"
                        min="0"
                        value={newProduct.minStock}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, minStock: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                        value={newProduct.supplier}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, supplier: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
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
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, unit: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="l">Liter</SelectItem>
                        <SelectItem value="ml">Milliliter</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isAddingProduct}>
                      {isAddingProduct ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Product'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>₱{product.price.toFixed(2)}</TableCell>
                    <TableCell>₱{product.cost.toFixed(2)}</TableCell>
                    <TableCell>{product.supplier.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
} 