import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    navigate({ to: '/product/$id', params: { id: product.id.toString() } });
  };

  const isOutOfStock = product.stockQuantity === BigInt(0);

  return (
    <Card
      className="product-card-hover cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="price-tag">${Number(product.price).toFixed(2)}</span>
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : (
            <Badge variant="secondary">{Number(product.stockQuantity)} in stock</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock || addToCart.isPending}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
