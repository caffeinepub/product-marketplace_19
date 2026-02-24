import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useGetCart, useGetAllProducts } from '../hooks/useQueries';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Cart() {
  const navigate = useNavigate();
  const { data: cart = [], isLoading } = useGetCart();
  const { data: products = [] } = useGetAllProducts();

  if (isLoading) {
    return (
      <div className="container section-spacing">
        <p className="text-center text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container section-spacing">
        <div className="max-w-md mx-auto text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Discover our curated collection of artisan goods
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-spacing animate-fade-in">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.productId.toString()} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CartSummary cart={cart} products={products} />
              <Separator />
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CartSummary({ cart, products }: { cart: any[]; products: any[] }) {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + Number(product.price) * Number(item.quantity);
  }, 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="font-medium">Calculated at checkout</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
