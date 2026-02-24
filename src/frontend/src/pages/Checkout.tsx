import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useCheckout, useGetAllProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart = [] } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const checkout = useCheckout();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    checkout.mutate(formData, {
      onSuccess: (orderId) => {
        toast.success('Order placed successfully!');
        navigate({ to: '/order-success/$orderId', params: { orderId: orderId.toString() } });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to place order');
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container section-spacing">
        <div className="max-w-md mx-auto text-center py-16">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate({ to: '/' })}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-spacing animate-fade-in">
      <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, State, ZIP"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  disabled={checkout.isPending}
                >
                  {checkout.isPending ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary cart={cart} products={products} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ cart, products }: { cart: any[]; products: any[] }) {
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  }).filter(({ product }) => product !== undefined);

  const subtotal = items.reduce((sum, { item, product }) => {
    return sum + Number(product!.price) * Number(item.quantity);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map(({ item, product }) => (
          <div key={item.productId.toString()} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {product!.name} × {Number(item.quantity)}
            </span>
            <span className="font-medium">
              ${(Number(product!.price) * Number(item.quantity)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
