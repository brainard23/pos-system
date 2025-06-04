import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NewSupplier } from '../../types/product';

interface SupplierFormProps {
  onSubmit: (supplier: NewSupplier) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function SupplierForm({ onSubmit, isLoading, onCancel }: SupplierFormProps) {
  const [supplier, setSupplier] = useState<NewSupplier>({
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(supplier);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={supplier.name}
          onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={supplier.email}
            onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={supplier.phone}
            onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={supplier.address.street}
          onChange={(e) =>
            setSupplier({
              ...supplier,
              address: { ...supplier.address, street: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={supplier.address.city}
            onChange={(e) =>
              setSupplier({
                ...supplier,
                address: { ...supplier.address, city: e.target.value },
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={supplier.address.state}
            onChange={(e) =>
              setSupplier({
                ...supplier,
                address: { ...supplier.address, state: e.target.value },
              })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={supplier.address.country}
            onChange={(e) =>
              setSupplier({
                ...supplier,
                address: { ...supplier.address, country: e.target.value },
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={supplier.address.zipCode}
            onChange={(e) =>
              setSupplier({
                ...supplier,
                address: { ...supplier.address, zipCode: e.target.value },
              })
            }
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Supplier'}
        </Button>
      </div>
    </form>
  );
} 