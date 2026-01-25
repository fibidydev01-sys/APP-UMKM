'use client';

import { useState } from 'react';
import {
  Camera,
  Package,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Save,
  Edit,
  Sparkles,
} from 'lucide-react';
import { Button } from '@umkm/shared';
import { Input } from '@umkm/shared';
import { Label } from '@umkm/shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@umkm/shared';
import { Badge } from '@umkm/shared';
import { Alert, AlertDescription, AlertTitle } from '@umkm/shared';
import { Separator } from '@umkm/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@umkm/shared';
import { toast } from 'sonner';

// ========================================
// Types & Interfaces
// ========================================

interface ProductNutrition {
  calories?: number;
  carbs?: number;
  sugars?: number;
  fat?: number;
  saturatedFat?: number;
  protein?: number;
  fiber?: number;
  salt?: number;
  sodium?: number;
}

interface Product {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  size?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  ingredientsImageUrl?: string;
  nutritionImageUrl?: string;
  nutrition?: ProductNutrition;
  ingredients?: string;
  allergens?: string;
  labels?: string[];
  isHalal?: boolean;
  origin?: string;
  manufacturingPlaces?: string;
  website?: string;
  source?: 'api' | 'cache' | 'manual' | 'not_found';
  dataQuality?: 'complete' | 'partial' | 'minimal';
  completeness?: number;
}

interface OpenFoodFactsResponse {
  code: string;
  status: 0 | 1;
  status_verbose: string;
  product?: any;
}

// ========================================
// API Client with Rate Limiting
// ========================================

class OpenFoodFactsClient {
  private requestTimestamps: number[] = [];
  private readonly MAX_REQUESTS_PER_MINUTE = 80;

  async getProduct(barcode: string): Promise<OpenFoodFactsResponse> {
    await this.waitIfNeeded();

    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'UMKM-POS-Demo/1.0',
      },
    });

    this.trackRequest();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  private async waitIfNeeded() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    this.requestTimestamps = this.requestTimestamps.filter((ts) => ts > oneMinuteAgo);

    if (this.requestTimestamps.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = this.requestTimestamps[0];
      const waitTime = 60000 - (now - oldestRequest);

      console.log(`Rate limit approaching, waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  private trackRequest() {
    this.requestTimestamps.push(Date.now());
  }
}

// ========================================
// Product Data Transformer
// ========================================

function transformOpenFoodFactsProduct(apiResponse: OpenFoodFactsResponse): Product | null {
  if (apiResponse.status === 0 || !apiResponse.product) {
    return null;
  }

  const product = apiResponse.product;

  return {
    barcode: apiResponse.code,
    name: product.product_name_id || product.product_name || 'Unknown Product',
    brand: product.brands || '',
    category: extractCategory(product.categories_tags),
    size: product.quantity || '',
    imageUrl: product.image_front_url || null,
    thumbnailUrl: product.image_front_thumb_url || null,
    ingredientsImageUrl: product.image_ingredients_url || null,
    nutritionImageUrl: product.image_nutrition_url || null,
    nutrition: {
      calories: product.nutriments?.['energy-kcal_100g'] || null,
      carbs: product.nutriments?.carbohydrates_100g || null,
      sugars: product.nutriments?.sugars_100g || null,
      fat: product.nutriments?.fat_100g || null,
      saturatedFat: product.nutriments?.['saturated-fat_100g'] || null,
      protein: product.nutriments?.proteins_100g || null,
      fiber: product.nutriments?.fiber_100g || null,
      salt: product.nutriments?.salt_100g || null,
      sodium: product.nutriments?.sodium_100g || null,
    },
    ingredients: product.ingredients_text_id || product.ingredients_text || '',
    allergens: product.allergens || '',
    labels: product.labels_tags || [],
    isHalal: product.labels_tags?.includes('en:halal') || false,
    origin: product.origins || '',
    manufacturingPlaces: product.manufacturing_places || '',
    website: product.link || '',
    source: 'api',
    dataQuality: calculateQuality(product.completeness),
    completeness: product.completeness || 0,
  };
}

function calculateQuality(completeness?: number): 'complete' | 'partial' | 'minimal' {
  if (!completeness) return 'minimal';
  if (completeness >= 0.8) return 'complete';
  if (completeness >= 0.5) return 'partial';
  return 'minimal';
}

function extractCategory(categoriesTags?: string[]): string {
  if (!categoriesTags || categoriesTags.length === 0) return 'Food';

  const instant = categoriesTags.find((c) => c.includes('instant-noodles'));
  if (instant) return 'Instant Noodles';

  const noodles = categoriesTags.find((c) => c.includes('noodles'));
  if (noodles) return 'Noodles';

  const last = categoriesTags[categoriesTags.length - 1];
  return last?.replace('en:', '').replace(/-/g, ' ') || 'Food';
}

// ========================================
// Mock Cache Database (Simulated)
// ========================================

const mockCache: Record<string, Product> = {
  '0089686171686': {
    barcode: '0089686171686',
    name: 'Instant Noodles Mi Goreng Hot & Spicy',
    brand: 'Indomie',
    category: 'Instant Noodles',
    size: '80g',
    imageUrl:
      'https://images.openfoodfacts.org/images/products/008/968/617/1686/front_en.34.400.jpg',
    thumbnailUrl:
      'https://images.openfoodfacts.org/images/products/008/968/617/1686/front_en.34.100.jpg',
    nutrition: {
      calories: 462,
      fat: 18.8,
      saturatedFat: 8.75,
      carbs: 63.8,
      sugars: 6.25,
      protein: 10,
      fiber: 2.82,
      salt: 2.55,
    },
    isHalal: true,
    source: 'cache',
    dataQuality: 'complete',
    completeness: 0.7875,
  },
};

// ========================================
// Main Component
// ========================================

export default function BarcodeScannerDemo() {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual form state
  const [manualProduct, setManualProduct] = useState({
    name: '',
    brand: '',
    category: '',
    size: '',
    price: '',
  });

  const apiClient = new OpenFoodFactsClient();

  const handleScan = async () => {
    if (!barcode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);
    setShowManualForm(false);

    try {
      // Step 1: Check mock cache
      if (mockCache[barcode]) {
        setProduct(mockCache[barcode]);
        toast.success('Product found in cache! ⚡');
        return;
      }

      // Step 2: Call API
      toast.info('Searching Open Food Facts...');
      const apiResponse = await apiClient.getProduct(barcode);

      const transformedProduct = transformOpenFoodFactsProduct(apiResponse);

      if (transformedProduct) {
        setProduct(transformedProduct);
        toast.success('Product found! 🎉');

        // Simulate saving to cache
        mockCache[barcode] = transformedProduct;
      } else {
        // Step 3: Product not found - show manual form
        setShowManualForm(true);
        toast.warning('Product not found - Please add manually');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      toast.error('Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSave = () => {
    if (!manualProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    const newProduct: Product = {
      barcode,
      name: manualProduct.name,
      brand: manualProduct.brand,
      category: manualProduct.category,
      size: manualProduct.size,
      source: 'manual',
      dataQuality: 'minimal',
    };

    setProduct(newProduct);
    mockCache[barcode] = newProduct;
    setShowManualForm(false);
    toast.success('Product saved successfully! ✅');
  };

  const getQualityBadge = (quality?: string) => {
    switch (quality) {
      case 'complete':
        return <Badge className="bg-green-500">Complete</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case 'minimal':
        return <Badge className="bg-orange-500">Minimal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'api':
        return (
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" /> API
          </Badge>
        );
      case 'cache':
        return (
          <Badge variant="secondary" className="gap-1">
            ⚡ Cache
          </Badge>
        );
      case 'manual':
        return (
          <Badge variant="outline" className="gap-1">
            <Edit className="w-3 h-3" /> Manual
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Camera className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Barcode Scanner Demo
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Scan barcodes and get product info from Open Food Facts API
          </p>
        </div>

        {/* Scanner Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Scan or Enter Barcode
            </CardTitle>
            <CardDescription>
              Try: 0089686171686 (Indomie - cached) or 0089686010343 (Indomie Soto)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter barcode number..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                className="text-lg"
              />
              <Button onClick={handleScan} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Manual Input Form */}
        {showManualForm && (
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Edit className="w-5 h-5" />
                Product Not Found - Add Manually
              </CardTitle>
              <CardDescription>
                This product is not in the database. Please add the information manually.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Indomie Goreng"
                    value={manualProduct.name}
                    onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Indomie"
                    value={manualProduct.brand}
                    onChange={(e) => setManualProduct({ ...manualProduct, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Instant Noodles"
                    value={manualProduct.category}
                    onChange={(e) =>
                      setManualProduct({ ...manualProduct, category: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size/Weight</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 80g"
                    value={manualProduct.size}
                    onChange={(e) => setManualProduct({ ...manualProduct, size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 3500"
                    value={manualProduct.price}
                    onChange={(e) => setManualProduct({ ...manualProduct, price: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleManualSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Product
              </Button>
              <Button variant="outline" onClick={() => setShowManualForm(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Product Display */}
        {product && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    {product.brand && <span className="font-semibold">{product.brand}</span>}
                    {product.category && <span>• {product.category}</span>}
                    {product.size && <span>• {product.size}</span>}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  {getSourceBadge(product.source)}
                  {getQualityBadge(product.dataQuality)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.imageUrl && (
                      <div className="flex justify-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="rounded-lg shadow-lg max-h-64 object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Barcode</Label>
                        <p className="font-mono text-lg">{product.barcode}</p>
                      </div>
                      {product.brand && (
                        <div>
                          <Label className="text-xs text-gray-500">Brand</Label>
                          <p>{product.brand}</p>
                        </div>
                      )}
                      {product.category && (
                        <div>
                          <Label className="text-xs text-gray-500">Category</Label>
                          <p>{product.category}</p>
                        </div>
                      )}
                      {product.size && (
                        <div>
                          <Label className="text-xs text-gray-500">Size</Label>
                          <p>{product.size}</p>
                        </div>
                      )}
                      {product.manufacturingPlaces && (
                        <div>
                          <Label className="text-xs text-gray-500">Manufacturing</Label>
                          <p>{product.manufacturingPlaces}</p>
                        </div>
                      )}
                      {product.isHalal && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-600">
                            Halal Certified
                          </span>
                        </div>
                      )}
                      {product.completeness !== undefined && (
                        <div>
                          <Label className="text-xs text-gray-500">Data Completeness</Label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${product.completeness * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {Math.round(product.completeness * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Nutrition Tab */}
                <TabsContent value="nutrition" className="space-y-4">
                  {product.nutrition && Object.values(product.nutrition).some((v) => v !== null) ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {product.nutrition.calories !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Calories</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.calories} kcal</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                      {product.nutrition.carbs !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Carbohydrates</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.carbs}g</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                      {product.nutrition.fat !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Fat</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.fat}g</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                      {product.nutrition.protein !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Protein</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.protein}g</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                      {product.nutrition.sugars !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Sugars</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.sugars}g</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                      {product.nutrition.salt !== null && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Salt</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{product.nutrition.salt}g</p>
                            <p className="text-xs text-gray-500">per 100g</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Nutrition Data</AlertTitle>
                      <AlertDescription>
                        Nutrition information is not available for this product.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* Ingredients Tab */}
                <TabsContent value="ingredients" className="space-y-4">
                  {product.ingredients ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Ingredients</Label>
                        <p className="mt-2 text-sm leading-relaxed">{product.ingredients}</p>
                      </div>
                      {product.allergens && (
                        <div>
                          <Label className="text-sm font-semibold text-orange-600">Allergens</Label>
                          <p className="mt-2 text-sm leading-relaxed">{product.allergens}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Ingredients Data</AlertTitle>
                      <AlertDescription>
                        Ingredients information is not available for this product.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.imageUrl && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Product Front</Label>
                        <img
                          src={product.imageUrl}
                          alt="Product Front"
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    )}
                    {product.ingredientsImageUrl && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Ingredients Label</Label>
                        <img
                          src={product.ingredientsImageUrl}
                          alt="Ingredients"
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    )}
                    {product.nutritionImageUrl && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Nutrition Facts</Label>
                        <img
                          src={product.nutritionImageUrl}
                          alt="Nutrition"
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    )}
                    {!product.imageUrl &&
                      !product.ingredientsImageUrl &&
                      !product.nutritionImageUrl && (
                        <Alert>
                          <Package className="h-4 w-4" />
                          <AlertTitle>No Images Available</AlertTitle>
                          <AlertDescription>Product images are not available.</AlertDescription>
                        </Alert>
                      )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Info Alert */}
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              1. <strong>Check Cache First:</strong> Instant results from local database (⚡
              lightning fast!)
            </p>
            <p>
              2. <strong>API Fallback:</strong> If not cached, fetch from Open Food Facts API
            </p>
            <p>
              3. <strong>Manual Input:</strong> If product not found, add it manually
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Rate Limit: 100 requests/minute • All data cached automatically
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
