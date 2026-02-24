import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderSuccess() {
  const { orderId } = useParams({ from: '/order-success/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="container section-spacing animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="h-20 w-20 text-secondary mx-auto mb-6" />
            <h1 className="font-display text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-2">
              Thank you for your purchase
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: <span className="font-mono font-medium">#{orderId}</span>
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">
                We've received your order and will begin processing it shortly. 
                You'll receive a confirmation email with tracking information once your order ships.
              </p>
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Button onClick={() => navigate({ to: '/' })} size="lg">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
