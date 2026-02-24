import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Catalog() {
  const { data: products = [], isLoading } = useGetAllProducts();

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Hero Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40 flex items-center">
          <div className="container">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
              Curated Artisan Goods
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover handcrafted treasures that bring warmth and character to your everyday life
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-spacing">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2">Our Collection</h2>
            <p className="text-muted-foreground">
              Each piece is carefully selected for quality and craftsmanship
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
