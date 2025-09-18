import { useEffect, useState } from 'react';
import { useInvestors } from '../../hooks/useInvestors';
import type { NewInvestor } from '../../services/investorService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

function InvestorsPage() {
  const { investors, performance, isLoading, loadInvestors, loadPerformance, addInvestor, editInvestor, removeInvestor } = useInvestors();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewInvestor>({ name: '', email: '', principal: 0, interest: 0.1, months: 12, startDate: new Date().toISOString() });

  useEffect(() => {
    loadInvestors();
    loadPerformance();
  }, [loadInvestors, loadPerformance]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addInvestor(form);
    setForm({ name: '', email: '', principal: 0, interest: 0.1, months: 12, startDate: new Date().toISOString() });
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Investors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
                <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Input placeholder="Principal" type="number" value={form.principal} onChange={e => setForm(f => ({ ...f, principal: Number(e.target.value) }))} />
                <Input placeholder="Interest (e.g., 0.1)" type="number" step="0.01" value={form.interest} onChange={e => setForm(f => ({ ...f, interest: Number(e.target.value) }))} />
                <Input placeholder="Months" type="number" value={form.months} onChange={e => setForm(f => ({ ...f, months: Number(e.target.value) }))} />
                <Input placeholder="Start Date" type="date" value={form.startDate.split('T')[0]} onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).toISOString() }))} />
                <div className="md:col-span-6 flex justify-end">
                  <Button type="submit" disabled={isLoading}>Add Investor</Button>
                </div>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Months</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investors.map(inv => (
                    <TableRow key={inv._id}>
                      <TableCell>
                        {editingId === inv._id ? (
                          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        ) : (
                          inv.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inv._id ? (
                          <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        ) : (
                          inv.email
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === inv._id ? (
                          <Input type="number" value={form.principal} onChange={e => setForm(f => ({ ...f, principal: Number(e.target.value) }))} />
                        ) : (
                          `₱${inv.principal.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === inv._id ? (
                          <Input type="number" step="0.01" value={form.interest} onChange={e => setForm(f => ({ ...f, interest: Number(e.target.value) }))} />
                        ) : (
                          `${(inv.interest * 100).toFixed(2)}%`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === inv._id ? (
                          <Input type="number" value={form.months} onChange={e => setForm(f => ({ ...f, months: Number(e.target.value) }))} />
                        ) : (
                          inv.months
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inv._id ? (
                          <Input type="date" value={form.startDate.split('T')[0]} onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).toISOString() }))} />
                        ) : (
                          new Date(inv.startDate).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingId === inv._id ? (
                          <>
                            <Button size="sm" onClick={async () => { await editInvestor(inv._id, form); setEditingId(null); }}>Save</Button>
                            <Button size="sm" variant="secondary" onClick={() => { setEditingId(null); }}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => { setEditingId(inv._id); setForm({ name: inv.name, email: inv.email, principal: inv.principal, interest: inv.interest, months: inv.months, startDate: inv.startDate }); }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={async () => { if (confirm('Delete investor?')) await removeInvestor(inv._id); }}>Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && investors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-gray-500">No investors</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Months</TableHead>
                    <TableHead className="text-right">Monthly Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map(p => (
                    <TableRow key={p._id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell className="text-right">₱{p.principal.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{(p.interest * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{p.months}</TableCell>
                      <TableCell className="text-right font-medium">₱{p.monthlyPayment.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InvestorsPage;


