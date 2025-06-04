import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Plus, Building2, Tag, Loader2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useCategories } from '../../hooks/useCategories';
import { ProductForm } from '../../components/forms/ProductForm';
import { SupplierForm } from '../../components/forms/SupplierForm';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { NewProduct, NewSupplier, NewCategory, Product } from '../../types/product';
import { CustomTable, Column } from '../../components/core/CustomTable';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const {
    products,
    currentPage,
    totalPages,
    searchQuery,
    isLoading: isLoadingProducts,
    setCurrentPage,
    setSearchQuery,
    addProduct,
  } = useProducts();

  const {
    suppliers,
    isLoading: isLoadingSuppliers,
    fetchSuppliers,
    addSupplier,
  } = useSuppliers();

  const {
    categories,
    isLoading: isLoadingCategories,
    fetchCategories,
    addCategory,
  } = useCategories();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleOpenProductDialog = useCallback(async () => {
    try {
      await Promise.all([fetchSuppliers(), fetchCategories()]);
      setIsProductDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load form data. Please try again.');
    }
  }, [fetchSuppliers, fetchCategories]);

  const handleAddProduct = async (product: NewProduct) => {
    try {
      setIsAddingProduct(true);
      await addProduct(product);
      toast.success('Product added successfully!');
      setIsProductDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleAddSupplier = async (supplier: NewSupplier) => {
    try {
      setIsAddingSupplier(true);
      await addSupplier(supplier);
      toast.success('Supplier added successfully!');
      setIsSupplierDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add supplier. Please try again.');
    } finally {
      setIsAddingSupplier(false);
    }
  };

  const handleAddCategory = async (category: NewCategory) => {
    try {
      setIsAddingCategory(true);
      await addCategory(category);
      toast.success('Category added successfully!');
      setIsCategoryDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add category. Please try again.');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const columns: Column<Product>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'SKU', accessorKey: 'sku' },
    { 
      header: 'Category', 
      accessorKey: (row) => row.category.name 
    },
    { 
      header: 'Supplier', 
      accessorKey: (row) => row.supplier.name 
    },
    { 
      header: 'Price', 
      accessorKey: (row) => `$${row.price.toFixed(2)}` 
    },
    { header: 'Stock', accessorKey: 'stock' },
    { header: 'Unit', accessorKey: 'unit' },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-2">
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenProductDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              {(isLoadingSuppliers || isLoadingCategories) ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <ProductForm
                  categories={categories}
                  suppliers={suppliers}
                  onSubmit={handleAddProduct}
                  isLoading={isAddingProduct}
                  onCancel={() => setIsProductDialogOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <SupplierForm
                onSubmit={handleAddSupplier}
                isLoading={isAddingSupplier}
                onCancel={() => setIsSupplierDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleAddCategory}
                isLoading={isAddingCategory}
                onCancel={() => setIsCategoryDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <CustomTable
        columns={columns}
        data={products}
        isLoading={isLoadingProducts}
        emptyMessage="No products found"
      />

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 