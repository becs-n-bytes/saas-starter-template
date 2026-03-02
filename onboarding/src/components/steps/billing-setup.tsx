'use client';

import { useWizard } from '@/lib/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BillingPlan, BillingProduct } from '@/lib/types';
import {
  Receipt,
  Plus,
  Trash2,
  Star,
  Info,
  Package,
} from 'lucide-react';

export function BillingSetup() {
  const { config, updateConfig } = useWizard();

  /* ── Plan helpers ── */
  function updatePlan(index: number, updates: Partial<BillingPlan>) {
    const plans = [...config.plans];
    plans[index] = { ...plans[index], ...updates };
    updateConfig({ plans });
  }

  function addPlan() {
    updateConfig({
      plans: [
        ...config.plans,
        {
          id: `plan-${Date.now()}`,
          name: '',
          description: '',
          monthlyPrice: 0,
          yearlyPrice: 0,
          stripePriceIdMonthly: '',
          stripePriceIdYearly: '',
          features: [''],
          highlighted: false,
        },
      ],
    });
  }

  function removePlan(index: number) {
    updateConfig({ plans: config.plans.filter((_, i) => i !== index) });
  }

  function updateFeature(planIndex: number, featureIndex: number, value: string) {
    const plans = [...config.plans];
    const features = [...plans[planIndex].features];
    features[featureIndex] = value;
    plans[planIndex] = { ...plans[planIndex], features };
    updateConfig({ plans });
  }

  function addFeature(planIndex: number) {
    const plans = [...config.plans];
    plans[planIndex] = {
      ...plans[planIndex],
      features: [...plans[planIndex].features, ''],
    };
    updateConfig({ plans });
  }

  function removeFeature(planIndex: number, featureIndex: number) {
    const plans = [...config.plans];
    plans[planIndex] = {
      ...plans[planIndex],
      features: plans[planIndex].features.filter((_, i) => i !== featureIndex),
    };
    updateConfig({ plans });
  }

  /* ── Product helpers ── */
  function updateProduct(index: number, updates: Partial<BillingProduct>) {
    const products = [...config.products];
    products[index] = { ...products[index], ...updates };
    updateConfig({ products });
  }

  function addProduct() {
    updateConfig({
      products: [
        ...config.products,
        {
          id: `product-${Date.now()}`,
          name: '',
          description: '',
          price: 0,
          stripePriceId: '',
        },
      ],
    });
  }

  function removeProduct(index: number) {
    updateConfig({ products: config.products.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
          <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Billing Plans</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure your subscription plans and one-time products. These define
          what appears on your pricing page and what options are available at
          checkout.
        </p>
      </div>

      {/* Info */}
      <div className="flex gap-3 rounded-lg border-l-4 border-blue-500 bg-blue-500/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Stripe Price IDs</p>
          <p className="mt-1">
            Create your products and prices in the{' '}
            <a
              href="https://dashboard.stripe.com/products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Stripe Product Catalog
            </a>{' '}
            first, then paste the Price IDs (
            <code className="rounded bg-muted px-1 font-mono text-xs">
              price_...
            </code>
            ) here. You can leave them empty for now and add them later.
          </p>
        </div>
      </div>

      {/* ── Subscription Plans ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Subscription Plans</h2>
          <Button variant="outline" size="sm" onClick={addPlan} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Plan
          </Button>
        </div>

        <div className="space-y-4">
          {config.plans.map((plan, planIndex) => (
            <Card key={plan.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {plan.name || 'Untitled Plan'}
                    </h3>
                    {plan.highlighted && (
                      <Badge className="gap-1 text-xs">
                        <Star className="h-3 w-3" />
                        Highlighted
                      </Badge>
                    )}
                  </div>
                  {config.plans.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlan(planIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                      value={plan.name}
                      onChange={(e) =>
                        updatePlan(planIndex, { name: e.target.value })
                      }
                      placeholder="e.g. Pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Plan ID</Label>
                    <Input
                      value={plan.id}
                      onChange={(e) =>
                        updatePlan(planIndex, { id: e.target.value })
                      }
                      placeholder="e.g. pro"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={plan.description}
                      onChange={(e) =>
                        updatePlan(planIndex, { description: e.target.value })
                      }
                      placeholder="e.g. For power users"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Pricing */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Monthly Price (cents)</Label>
                    <Input
                      type="number"
                      value={plan.monthlyPrice}
                      onChange={(e) =>
                        updatePlan(planIndex, {
                          monthlyPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="999"
                    />
                    <p className="text-xs text-muted-foreground">
                      {plan.monthlyPrice > 0
                        ? `$${(plan.monthlyPrice / 100).toFixed(2)}/mo`
                        : 'Free'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Yearly Price (cents)</Label>
                    <Input
                      type="number"
                      value={plan.yearlyPrice}
                      onChange={(e) =>
                        updatePlan(planIndex, {
                          yearlyPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="7999"
                    />
                    <p className="text-xs text-muted-foreground">
                      {plan.yearlyPrice > 0
                        ? `$${(plan.yearlyPrice / 100).toFixed(2)}/yr`
                        : 'Free'}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Stripe Price IDs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Stripe Monthly Price ID</Label>
                    <Input
                      value={plan.stripePriceIdMonthly}
                      onChange={(e) =>
                        updatePlan(planIndex, {
                          stripePriceIdMonthly: e.target.value,
                        })
                      }
                      placeholder="price_..."
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stripe Yearly Price ID</Label>
                    <Input
                      value={plan.stripePriceIdYearly}
                      onChange={(e) =>
                        updatePlan(planIndex, {
                          stripePriceIdYearly: e.target.value,
                        })
                      }
                      placeholder="price_..."
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Features */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Features</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addFeature(planIndex)}
                      className="h-7 gap-1 text-xs"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) =>
                            updateFeature(planIndex, featureIndex, e.target.value)
                          }
                          placeholder="e.g. Unlimited projects"
                          className="text-sm"
                        />
                        {plan.features.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(planIndex, featureIndex)}
                            className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Highlight toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plan.highlighted}
                    onChange={(e) =>
                      updatePlan(planIndex, { highlighted: e.target.checked })
                    }
                    className="rounded accent-primary"
                  />
                  <span className="text-sm">
                    Highlight this plan on the pricing page
                  </span>
                </label>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── One-Time Products ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-4 w-4 text-muted-foreground" />
            One-Time Products
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={addProduct}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </div>

        <div className="space-y-4">
          {config.products.map((product, productIndex) => (
            <Card key={product.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    {product.name || 'Untitled Product'}
                  </h3>
                  {config.products.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(productIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(productIndex, { name: e.target.value })
                      }
                      placeholder="e.g. Lifetime Access"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product ID</Label>
                    <Input
                      value={product.id}
                      onChange={(e) =>
                        updateProduct(productIndex, { id: e.target.value })
                      }
                      placeholder="e.g. lifetime"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={product.description}
                      onChange={(e) =>
                        updateProduct(productIndex, {
                          description: e.target.value,
                        })
                      }
                      placeholder="e.g. Pay once, use forever"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (cents)</Label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(productIndex, {
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="4999"
                    />
                    <p className="text-xs text-muted-foreground">
                      {product.price > 0
                        ? `$${(product.price / 100).toFixed(2)}`
                        : 'Free'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Stripe Price ID</Label>
                    <Input
                      value={product.stripePriceId}
                      onChange={(e) =>
                        updateProduct(productIndex, {
                          stripePriceId: e.target.value,
                        })
                      }
                      placeholder="price_..."
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {config.products.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No one-time products configured. Click &quot;Add Product&quot; to add
              one, or skip this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
