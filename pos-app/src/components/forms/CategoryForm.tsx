import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NewCategory } from '../../types/product';

interface CategoryFormProps {
  onSubmit: (category: NewCategory) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, isLoading, onCancel }: CategoryFormProps) {
  const [category, setCategory] = useState<NewCategory>({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={category.description}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
} 