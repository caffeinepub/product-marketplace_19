import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { useGetProduct, useAddToCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(id));
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate(
      { productId: product.id, quantity: BigInt(1) },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to add to cart');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container section-spacing">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-spacing text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === BigInt(0);

  return (
    <div className="container section-spacing animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex-1">
            <h1 className="font-display text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="price-tag text-4xl">${Number(product.price).toFixed(2)}</span>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
              ) : (
                <Badge variant="secondary" className="text-sm">
                  <Package className="mr-1 h-3 w-3" />
                  {Number(product.stockQuantity)} available
                </Badge>
              )}
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-3">Product Details</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Product ID</dt>
                    <dd className="font-medium">{product.id.toString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Availability</dt>
                    <dd className="font-medium">
                      {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
