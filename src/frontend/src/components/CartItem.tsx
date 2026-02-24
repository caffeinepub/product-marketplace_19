import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateCartItem, useRemoveCartItem, useGetProduct } from '../hooks/useQueries';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { data: product } = useGetProduct(item.productId);
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  if (!product) return null;

  const handleUpdateQuantity = (newQuantity: bigint) => {
    if (newQuantity < BigInt(1)) return;
    updateCartItem.mutate(
      { productId: item.productId, quantity: newQuantity },
      {
        onError: (error) => {
          toast.error(error.message || 'Failed to update quantity');
        },
      }
    );
  };

  const handleRemove = () => {
    removeCartItem.mutate(item.productId, {
      onSuccess: () => {
        toast.success('Item removed from cart');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to remove item');
      },
    });
  };

  const subtotal = Number(product.price) * Number(item.quantity);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">${Number(product.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(item.quantity - BigInt(1))}
                  disabled={updateCartItem.isPending || item.quantity <= BigInt(1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium">{Number(item.quantity)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleUpdateQuantity(item.quantity + BigInt(1))}
                  disabled={updateCartItem.isPending || item.quantity >= product.stockQuantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={removeCartItem.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
