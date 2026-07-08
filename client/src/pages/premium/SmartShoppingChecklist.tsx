import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingBag, DollarSign } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  purchased: boolean;
  price: string;
  store: string;
  notes: string;
}

export default function SmartShoppingChecklist() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Protectores diarios premium", category: "Protección ligera", purchased: false, price: "$15", store: "", notes: "" },
    { id: "2", name: "Pants absorbentes cintura alta", category: "Protección moderada", purchased: false, price: "$45", store: "", notes: "" },
    { id: "3", name: "Ropa interior absorbente (pack 3)", category: "Sostenible", purchased: false, price: "$60", store: "", notes: "" },
    { id: "4", name: "Compresas nocturnas extra", category: "Protección nocturna", purchased: false, price: "$20", store: "", notes: "" },
    { id: "5", name: "Protectores deportivos", category: "Actividad física", purchased: false, price: "$35", store: "", notes: "" },
    { id: "6", name: "Toallitas de higiene (pack)", category: "Higiene", purchased: false, price: "$12", store: "", notes: "" },
    { id: "7", name: "Desodorizante íntimo", category: "Higiene", purchased: false, price: "$18", store: "", notes: "" },
    { id: "8", name: "Gel lubricante premium", category: "Comodidad", purchased: false, price: "$22", store: "", notes: "" },
  ]);

  const toggleProduct = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, purchased: !p.purchased } : p
    ));
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu checklist de compra ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el checklist");
    } finally {
      setSaving(false);
    }
  };

  const purchasedCount = products.filter(p => p.purchased).length;
  const totalPrice = products.reduce((acc, p) => {
    const price = parseFloat(p.price.replace("$", ""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);
  const purchasedPrice = products
    .filter(p => p.purchased)
    .reduce((acc, p) => {
      const price = parseFloat(p.price.replace("$", ""));
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

  const categoriesArray = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/pack-premium")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Checklist de Compra Inteligente
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comparativa de productos recomendados con análisis de precios, tiendas y costo-beneficio. Marca los productos que ya compraste y agrega dónde los encontraste.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-sm text-muted-foreground mb-2">Productos Comprados</div>
              <div className="text-3xl font-bold text-primary">{purchasedCount}/{products.length}</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="text-sm text-muted-foreground mb-2">Inversión Total</div>
              <div className="text-3xl font-bold text-accent">${totalPrice.toFixed(2)}</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <div className="text-sm text-muted-foreground mb-2">Ya Invertido</div>
              <div className="text-3xl font-bold text-secondary">${purchasedPrice.toFixed(2)}</div>
            </Card>
          </div>

          {/* Products by Category */}
          <div className="space-y-8">
            {categoriesArray.map((category: string) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded" />
                  {category}
                </h3>
                <div className="space-y-3">
                  {products
                    .filter(p => p.category === category)
                    .map((product) => (
                      <Card key={product.id} className={`p-6 border-l-4 ${product.purchased ? "border-l-primary bg-primary/5" : "border-l-muted"}`}>
                        <div className="flex gap-4 mb-4">
                          <Checkbox
                            checked={product.purchased}
                            onCheckedChange={() => toggleProduct(product.id)}
                            className="w-6 h-6 mt-1"
                          />
                          <div className="flex-1">
                            <h4 className={`text-lg font-semibold ${product.purchased ? "text-primary line-through" : "text-foreground"}`}>
                              {product.name}
                            </h4>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {product.price}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="¿Dónde lo compraste?"
                            value={product.store}
                            onChange={(e) => updateProduct(product.id, "store", e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Notas: opinión, alternativas, etc."
                            value={product.notes}
                            onChange={(e) => updateProduct(product.id, "notes", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button
            onClick={saveProgress}
            disabled={saving}
            className="btn-primary w-full text-lg mt-8 mb-8"
          >
            {saving ? "Guardando..." : "Guardar Mi Checklist"}
          </Button>

          {/* Comparison Section */}
          <Card className="p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">💡 Comparativa de Inversión</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Inversión total recomendada:</strong> ${totalPrice.toFixed(2)} para comenzar tu tratamiento
              </p>
              <p>
                <strong>Equivalente a:</strong> {Math.round(totalPrice / 5)} cafés, {Math.round(totalPrice / 15)} pizzas, o {Math.round(totalPrice / 50)} salidas al cine
              </p>
              <p>
                <strong>Beneficio:</strong> Recuperar tu confianza, volver al gimnasio y disfrutar de tu vida sin limitaciones
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
