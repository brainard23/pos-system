import { useEffect, useMemo, useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import type { Transaction, PaymentMethod } from '../../types/transaction';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

function SalesPage() {
  const { transactions, isLoading, loadTransactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');

  useEffect(() => {
    loadTransactions({ status: 'completed' });
  }, [loadTransactions]);

  const filtered: Transaction[] = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(t => {
      const idMatch = t._id?.toLowerCase().includes(q);
      const methodMatch = t.paymentMethod?.toLowerCase().includes(q);
      const itemMatch = t.items?.some(i => i.product?.name?.toLowerCase().includes(q));
      const passMethod = methodFilter === 'all' ? true : t.paymentMethod === methodFilter;
      return Boolean((idMatch || methodMatch || itemMatch) && passMethod);
    });
  }, [transactions, search, methodFilter]);

  const summary = useMemo(() => computeSummary(methodFilter === 'all' ? transactions : transactions.filter(t => t.paymentMethod === methodFilter)), [transactions, methodFilter]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Transactions</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Sales (Completed Transactions)</CardTitle>
                <div className="w-64">
                  <Input
                    placeholder="Search by ID, method, or item"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-2">
                {isLoading ? 'Loading sales...' : `${filtered.length} transaction(s)`}
              </div>
              <ScrollArea className="h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(t => (
                      <TransactionRow key={t._id} tx={t} />
                    ))}
                    {!isLoading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-sm text-gray-500">No results</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Sales Summary</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <button className={`px-3 py-1 rounded-md border ${methodFilter==='all'?'border-primary text-primary bg-primary/10':'border-muted'}`} onClick={() => setMethodFilter('all')}>All</button>
                  <button className={`px-3 py-1 rounded-md border ${methodFilter==='cash'?'border-primary text-primary bg-primary/10':'border-muted'}`} onClick={() => setMethodFilter('cash')}>Cash</button>
                  <button className={`px-3 py-1 rounded-md border ${methodFilter==='gcash'?'border-primary text-primary bg-primary/10':'border-muted'}`} onClick={() => setMethodFilter('gcash')}>Gcash</button>
                  <button className={`px-3 py-1 rounded-md border ${methodFilter==='credit_card'?'border-primary text-primary bg-primary/10':'border-muted'}`} onClick={() => setMethodFilter('credit_card')}>Credit Card</button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryBlock title="Today" {...summary.day} />
                <SummaryBlock title="This Month" {...summary.month} />
                <SummaryBlock title="This Year" {...summary.year} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const [open, setOpen] = useState(false);
  const date = new Date(tx.createdAt);
  const discountLabel = tx.discount ? (tx.discount.type === 'percentage' ? `${tx.discount.value}%` : `₱${tx.discount.value}`) : '-';

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => setOpen(v => !v)}>
        <TableCell>{date.toLocaleString()}</TableCell>
        <TableCell className="font-mono text-xs">{tx._id}</TableCell>
        <TableCell className="capitalize">{tx.paymentMethod.replace('_', ' ')}</TableCell>
        <TableCell className="text-right">{tx.items?.length ?? 0}</TableCell>
        <TableCell className="text-right">₱{tx.subtotal.toFixed(2)}</TableCell>
        <TableCell className="text-right">{discountLabel}</TableCell>
        <TableCell className="text-right font-semibold">₱{tx.total.toFixed(2)}</TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="py-2">
              <div className="text-xs font-medium mb-2">Items</div>
              <Separator className="mb-2" />
              <div className="space-y-2">
                {tx.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex-1 truncate pr-2">
                      {it.product?.name}
                      <span className="ml-2 text-xs text-gray-500">x{it.quantity}</span>
                    </div>
                    <div className="w-28 text-right">₱{it.price.toFixed(2)}</div>
                    <div className="w-28 text-right font-medium">₱{it.subtotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default SalesPage;

function computeSummary(transactions: Transaction[]) {
  const now = new Date();
  const isSameDay = (d: Date) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  const isSameMonth = (d: Date) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  const isSameYear = (d: Date) => d.getFullYear() === now.getFullYear();

  const base = { revenue: 0, cost: 0, profit: 0, count: 0 };
  const totals: any = { day: { ...base }, month: { ...base }, year: { ...base } };

  for (const t of transactions) {
    const d = new Date(t.createdAt);
    const buckets: Array<keyof typeof totals> = [];
    if (isSameDay(d)) buckets.push('day');
    if (isSameMonth(d)) buckets.push('month');
    if (isSameYear(d)) buckets.push('year');

    const revenue = Number(t.total) || 0;
    // Cost is sum of item.product.cost * quantity (fallback 0 if missing)
    const cost = (t.items || []).reduce((sum, it) => sum + (Number((it.product as any)?.cost) || 0) * (Number(it.quantity) || 0), 0);

    for (const b of buckets) {
      totals[b].revenue += revenue;
      totals[b].cost += cost;
      totals[b].profit += revenue - cost;
      totals[b].count += 1;
    }
  }

  return totals as {
    day: { revenue: number; cost: number; profit: number; count: number };
    month: { revenue: number; cost: number; profit: number; count: number };
    year: { revenue: number; cost: number; profit: number; count: number };
  };
}

function SummaryBlock({ title, revenue, cost, profit, count }: { title: string; revenue: number; cost: number; profit: number; count: number }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">₱{revenue.toFixed(2)}</div>
      <div className="text-sm text-gray-500">Transactions: {count}</div>
      <Separator />
      <div className="flex items-center justify-between text-sm">
        <span>Cost</span>
        <span>₱{cost.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Profit</span>
        <span className={profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>₱{profit.toFixed(2)}</span>
      </div>
    </div>
  );
}


