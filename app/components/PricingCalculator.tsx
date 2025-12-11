"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Unit = "per 1 kg" | "per 500g" | "per 350g" | "per 250g" | "per 200g";

interface ProductData {
  purchaseCost: number;
  shippingCost: number;
  amazonReferral: number;
  packagingCost: number;
  margin: number;
  gstRate: number;
}

const PRODUCT_DEFAULTS: Record<string, Record<Unit, ProductData>> = {
  "Cane Jaggery Powder": {
    "per 1 kg": { purchaseCost: 50, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 15, gstRate: 5 },
    "per 500g": { purchaseCost: 25, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 15, gstRate: 5 },
    "per 350g": { purchaseCost: 17.5, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 15, gstRate: 5 },
    "per 250g": { purchaseCost: 12.5, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 15, gstRate: 5 },
    "per 200g": { purchaseCost: 10, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 15, gstRate: 5 },
  },
  "Peanuts": {
    "per 1 kg": { purchaseCost: 130, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 7, gstRate: 5 },
    "per 500g": { purchaseCost: 65, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 7, gstRate: 5 },
    "per 350g": { purchaseCost: 45.5, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 7, gstRate: 5 },
    "per 250g": { purchaseCost: 32.5, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 7, gstRate: 5 },
    "per 200g": { purchaseCost: 26, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 7, gstRate: 5 },
  },
  "Ragi Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 21, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 21, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 21, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 21, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 21, gstRate: 5 },
  },
  "Sprouted Ragi Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 40.16, packagingCost: 20, margin: 26.2, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 7.08, packagingCost: 20, margin: 22, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 4.95, packagingCost: 20, margin: 22, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 22, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 2.83, packagingCost: 20, margin: 22, gstRate: 5 },
  },
  "Cashew Nuts": {
    "per 1 kg": { purchaseCost: 920, shippingCost: 100, amazonReferral: 225.27, packagingCost: 20, margin: 8.3, gstRate: 5 },
    "per 500g": { purchaseCost: 460, shippingCost: 76, amazonReferral: 107.14, packagingCost: 20, margin: 7.1, gstRate: 5 },
    "per 350g": { purchaseCost: 322, shippingCost: 76, amazonReferral: 75, packagingCost: 20, margin: 7.1, gstRate: 5 },
    "per 250g": { purchaseCost: 230, shippingCost: 76, amazonReferral: 53.57, packagingCost: 20, margin: 7.1, gstRate: 5 },
    "per 200g": { purchaseCost: 184, shippingCost: 76, amazonReferral: 42.86, packagingCost: 20, margin: 7.1, gstRate: 5 },
  },
  "Black Rice Porridge Mix": {
    "per 1 kg": { purchaseCost: 228, shippingCost: 100, amazonReferral: 20.16, packagingCost: 20, margin: 23, gstRate: 5 },
    "per 500g": { purchaseCost: 114, shippingCost: 76, amazonReferral: 10.08, packagingCost: 20, margin: 23, gstRate: 5 },
    "per 350g": { purchaseCost: 80, shippingCost: 76, amazonReferral: 7.08, packagingCost: 20, margin: 23, gstRate: 5 },
    "per 250g": { purchaseCost: 60, shippingCost: 76, amazonReferral: 7.08, packagingCost: 20, margin: 14, gstRate: 5 },
    "per 200g": { purchaseCost: 45.6, shippingCost: 76, amazonReferral: 5.04, packagingCost: 20, margin: 23, gstRate: 5 },
  },
  "Rice Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 18, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 18, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 18, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 18, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 18, gstRate: 5 },
  },
  "Steamed Rice Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 24.5, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 24.5, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 24.5, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 24.5, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 24.5, gstRate: 5 },
  },
  "WheatFlour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 21.2, gstRate: 5 },
  },
  "Golden Maize Corn Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 21.2, gstRate: 5 },
  },
  "Jowar Atta Sorghum Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 21.2, gstRate: 5 },
  },
  "Pesarattu Dosa Mix Flour": {
    "per 1 kg": { purchaseCost: 60, shippingCost: 100, amazonReferral: 7.08, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 500g": { purchaseCost: 30, shippingCost: 76, amazonReferral: 3.54, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 350g": { purchaseCost: 21, shippingCost: 76, amazonReferral: 2.48, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 250g": { purchaseCost: 15, shippingCost: 76, amazonReferral: 1.77, packagingCost: 20, margin: 21.2, gstRate: 5 },
    "per 200g": { purchaseCost: 12, shippingCost: 76, amazonReferral: 1.42, packagingCost: 20, margin: 21.2, gstRate: 5 },
  },
  "Green Tea": {
    "per 1 kg": { purchaseCost: 800, shippingCost: 100, amazonReferral: 35.4, packagingCost: 20, margin: 29, gstRate: 5 },
    "per 500g": { purchaseCost: 400, shippingCost: 76, amazonReferral: 17.7, packagingCost: 20, margin: 29, gstRate: 5 },
    "per 350g": { purchaseCost: 280, shippingCost: 76, amazonReferral: 12.39, packagingCost: 20, margin: 29, gstRate: 5 },
    "per 250g": { purchaseCost: 200, shippingCost: 76, amazonReferral: 8.85, packagingCost: 20, margin: 29, gstRate: 5 },
    "per 200g": { purchaseCost: 160, shippingCost: 76, amazonReferral: 7.08, packagingCost: 20, margin: 29, gstRate: 5 },
  },
};

const PRODUCTS = Object.keys(PRODUCT_DEFAULTS);

interface CalculationResults {
  totalCost: number;
  profit: number;
  sellingPreGST: number;
  gstAmount: number;
  finalPrice: number;
}

export default function PricingCalculator() {
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState<Unit>("per 1 kg");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [amazonReferral, setAmazonReferral] = useState("");
  const [packagingCost, setPackagingCost] = useState("");
  const [margin, setMargin] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [activeTab, setActiveTab] = useState<
    "results" | "formulas" | "breakdown"
  >("results");

  // Handle product selection
  const handleProductChange = (product: string) => {
    setProductName(product);
    if (product && PRODUCT_DEFAULTS[product]) {
      const defaults = PRODUCT_DEFAULTS[product][unit];
      if (defaults) {
        setPurchaseCost(defaults.purchaseCost.toString());
        setShippingCost(defaults.shippingCost.toString());
        setAmazonReferral(defaults.amazonReferral.toString());
        setPackagingCost(defaults.packagingCost.toString());
        setMargin(defaults.margin.toString());
        setGstRate(defaults.gstRate.toString());
      }
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    if (productName && PRODUCT_DEFAULTS[productName]) {
      const defaults = PRODUCT_DEFAULTS[productName][newUnit];
      if (defaults) {
        setPurchaseCost(defaults.purchaseCost.toString());
        setShippingCost(defaults.shippingCost.toString());
        setAmazonReferral(defaults.amazonReferral.toString());
        setPackagingCost(defaults.packagingCost.toString());
        setMargin(defaults.margin.toString());
        setGstRate(defaults.gstRate.toString());
      }
    }
  };



  const calculate = (): CalculationResults | null => {
    const purchase = parseFloat(purchaseCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const referral = parseFloat(amazonReferral) || 0;
    const packaging = parseFloat(packagingCost) || 0;
    const marginPercent = parseFloat(margin) || 0;
    const gstPercent = parseFloat(gstRate) || 0;

    if (!purchase && !shipping && !referral && !packaging) {
      return null;
    }

    // Total cost = Purchase + Shipping + Referral + Packaging
    const totalCost = purchase + shipping + referral + packaging;

    // Selling price before GST = Total cost / (1 - (Margin % / 100))
    const sellingPreGST = totalCost / (1 - marginPercent / 100);

    // Profit = Selling price before GST - Total cost
    const profit = sellingPreGST - totalCost;

    // GST amount = Selling price before GST × (GST % / 100)
    const gstAmount = sellingPreGST * (gstPercent / 100);

    // Final selling price = Selling price before GST + GST amount
    const finalPrice = sellingPreGST + gstAmount;

    return {
      totalCost,
      profit,
      sellingPreGST,
      gstAmount,
      finalPrice,
    };
  };

  const results = calculate();

  const formatCurrency = (value: number) => {
    return `₹ ${value.toFixed(2)}`;
  };

  const getPieChartData = () => {
    if (!results) return [];

    const purchase = parseFloat(purchaseCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const referral = parseFloat(amazonReferral) || 0;
    const packaging = parseFloat(packagingCost) || 0;
    const profit = results.profit;
    const gst = results.gstAmount;
    const finalPrice = results.finalPrice;

    if (finalPrice === 0) return [];

    const data = [
      {
        name: "Purchase Cost",
        value: purchase,
        percentage: 0,
      },
      {
        name: "Shipping Cost",
        value: shipping,
        percentage: 0,
      },
      {
        name: "Referral Fee",
        value: referral,
        percentage: 0,
      },
      {
        name: "Packaging Cost",
        value: packaging,
        percentage: 0,
      },
      {
        name: "Profit",
        value: profit,
        percentage: 0,
      },
      {
        name: "GST Amount",
        value: gst,
        percentage: 0,
      },
    ].filter((item) => item.value > 0);

    // Calculate percentages and ensure they sum to 100%
    let totalPercentage = 0;
    for (let i = 0; i < data.length; i++) {
      if (i < data.length - 1) {
        // For all items except the last, round to 2 decimal places
        data[i].percentage = parseFloat(
          ((data[i].value / finalPrice) * 100).toFixed(2)
        );
        totalPercentage += data[i].percentage;
      } else {
        // For the last item, adjust to make total exactly 100%
        data[i].percentage = parseFloat((100 - totalPercentage).toFixed(2));
      }
    }

    // Convert percentages to strings with 2 decimal places
    return data.map((item) => ({
      ...item,
      percentage: item.percentage.toFixed(2),
    }));
  };

  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
  ];

  const renderCustomLabel = (props: {
    name?: string;
    payload?: { percentage: string };
  }) => {
    if (!props.payload || !props.name) return "";
    return `${props.name}: ${props.payload.percentage}%`;
  };

  const exportToCSV = () => {
    if (!results) return;

    const csvData = [
      ["Product Pricing Calculator - Results"],
      [""],
      ["Product Information"],
      ["Product Name", productName || "N/A"],
      ["Unit", unit],
      ["Purchase Cost", `₹ ${parseFloat(purchaseCost) || 0}`],
      ["Shipping Cost", `₹ ${parseFloat(shippingCost) || 0}`],
      ["Amazon Referral", `₹ ${parseFloat(amazonReferral) || 0}`],
      ["Packaging Cost", `₹ ${parseFloat(packagingCost) || 0}`],
      ["Margin", `${margin}%`],
      ["GST Rate", `${gstRate}%`],
      [""],
      ["Calculation Results"],
      ["Total Cost", formatCurrency(results.totalCost)],
      ["Profit", formatCurrency(results.profit)],
      ["Selling (pre-GST)", formatCurrency(results.sellingPreGST)],
      ["GST Amount", formatCurrency(results.gstAmount)],
      ["Final Price", formatCurrency(results.finalPrice)],
      [""],
      ["Final Price Breakdown"],
      ["Purchase Cost", formatCurrency(parseFloat(purchaseCost) || 0)],
      ["Shipping Cost", formatCurrency(parseFloat(shippingCost) || 0)],
      ["Referral Fee", formatCurrency(parseFloat(amazonReferral) || 0)],
      ["Packaging Cost", formatCurrency(parseFloat(packagingCost) || 0)],
      ["Profit", formatCurrency(results.profit)],
      ["GST Amount", formatCurrency(results.gstAmount)],
      ["Final Selling Price", formatCurrency(results.finalPrice)],
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pricing-calculator-${productName || "product"}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!results) return;

    const text = `Product Pricing Calculator - Results

Product Information
-------------------
Product Name: ${productName || "N/A"}
Unit: ${unit}
Purchase Cost: ₹ ${parseFloat(purchaseCost) || 0}
Shipping Cost: ₹ ${parseFloat(shippingCost) || 0}
Amazon Referral: ₹ ${parseFloat(amazonReferral) || 0}
Packaging Cost: ₹ ${parseFloat(packagingCost) || 0}
Margin: ${margin}%
GST Rate: ${gstRate}%

Calculation Results
-------------------
Total Cost: ${formatCurrency(results.totalCost)}
Profit: ${formatCurrency(results.profit)}
Selling (pre-GST): ${formatCurrency(results.sellingPreGST)}
GST Amount: ${formatCurrency(results.gstAmount)}
Final Price: ${formatCurrency(results.finalPrice)}

Final Price Breakdown
---------------------
Purchase Cost: ${formatCurrency(parseFloat(purchaseCost) || 0)}
Shipping Cost: ${formatCurrency(parseFloat(shippingCost) || 0)}
Referral Fee: ${formatCurrency(parseFloat(amazonReferral) || 0)}
Packaging Cost: ${formatCurrency(parseFloat(packagingCost) || 0)}
Profit: ${formatCurrency(results.profit)}
GST Amount: ${formatCurrency(results.gstAmount)}
---------------------------------
Final Selling Price: ${formatCurrency(results.finalPrice)}
---------------------------------`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    }
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Product Pricing Calculator
          </h1>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1.8fr] gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 border border-zinc-100">
            <h2 className="text-xl font-semibold mb-6 text-black">
              Product Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Product name:
                </label>
                <select
                  value={productName}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {PRODUCTS.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Unit:
                </label>
                <select
                  value={unit}
                  onChange={(e) => handleUnitChange(e.target.value as Unit)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per 1 kg">per 1 kg</option>
                  <option value="per 500g">per 500g</option>
                  <option value="per 350g">per 350g</option>
                  <option value="per 250g">per 250g</option>
                  <option value="per 200g">per 200g</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Purchase cost:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₹ 50.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Shipping cost:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₹ 100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Amazon referral:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amazonReferral}
                  onChange={(e) => setAmazonReferral(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₹ 7.08"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Packaging cost:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₹ 20.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  Margin %:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700">
                  GST Rate %:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5%"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 border border-zinc-100">
            {/* Tabs */}
            <div className="flex border-b border-zinc-200 mb-6">
              <button
                onClick={() => setActiveTab("results")}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  activeTab === "results"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Calculation Results
              </button>
              <button
                onClick={() => setActiveTab("formulas")}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  activeTab === "formulas"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Calculation Formulas
              </button>
              <button
                onClick={() => setActiveTab("breakdown")}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  activeTab === "breakdown"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Cost Breakdown
              </button>
            </div>

            {activeTab === "results" ? (
              results ? (
                <div className="space-y-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">
                        Total cost:
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrency(results.totalCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">
                        Profit:
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(results.profit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">
                        Selling (pre-GST):
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrency(results.sellingPreGST)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">
                        GST Amount:
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrency(results.gstAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 mt-3 border-t-2 border-zinc-400 font-bold text-lg">
                      <span className="text-black">
                        Final Price:
                      </span>
                      <span className="text-blue-600">
                        {formatCurrency(results.finalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">
                      Final Price Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          Purchase Cost:
                        </span>
                        <span className="text-black">
                          {formatCurrency(parseFloat(purchaseCost) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          Shipping Cost:
                        </span>
                        <span className="text-black">
                          {formatCurrency(parseFloat(shippingCost) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          Referral Fee:
                        </span>
                        <span className="text-black">
                          {formatCurrency(parseFloat(amazonReferral) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          Packaging Cost:
                        </span>
                        <span className="text-black">
                          {formatCurrency(parseFloat(packagingCost) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          Profit:
                        </span>
                        <span className="text-green-600">
                          {formatCurrency(results.profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">
                          GST Amount:
                        </span>
                        <span className="text-black">
                          {formatCurrency(results.gstAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 mt-3 border-t-2 border-zinc-400 font-bold text-lg">
                        <span className="text-black">
                          Final Selling Price:
                        </span>
                        <span className="text-blue-600">
                          {formatCurrency(results.finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-zinc-300">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={exportToCSV}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Export Results to CSV
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Copy Results
                      </button>
                      <button
                        onClick={printResults}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Print Results
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  Enter product information to see calculations
                </div>
              )
            ) : activeTab === "formulas" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-black">
                  Calculation Formulas
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-zinc-50 rounded-lg overflow-x-auto">
                    <div className="font-semibold text-zinc-900 mb-2">
                      Total cost
                    </div>
                    <div className="text-zinc-700 font-mono whitespace-nowrap">
                      = Purchase + Shipping + Referral + Packaging
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg overflow-x-auto">
                    <div className="font-semibold text-zinc-900 mb-2">
                      Selling price before GST
                    </div>
                    <div className="text-zinc-700 font-mono whitespace-nowrap">
                      = Total cost / (1 - (Margin % / 100))
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg overflow-x-auto">
                    <div className="font-semibold text-zinc-900 mb-2">
                      Profit
                    </div>
                    <div className="text-zinc-700 font-mono whitespace-nowrap">
                      = Selling price before GST - Total cost
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg overflow-x-auto">
                    <div className="font-semibold text-zinc-900 mb-2">
                      GST amount
                    </div>
                    <div className="text-zinc-700 font-mono whitespace-nowrap">
                      = Selling price before GST × (GST % / 100)
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg overflow-x-auto">
                    <div className="font-semibold text-zinc-900 mb-2">
                      Final selling price
                    </div>
                    <div className="text-zinc-700 font-mono whitespace-nowrap">
                      = Selling price before GST + GST amount
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-black">
                  Cost Breakdown
                </h3>
                {results && getPieChartData().length > 0 ? (
                  <>
                    <div className="bg-zinc-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0];
                                const percentage =
                                  (data.payload as { percentage: string })
                                    .percentage || "0";
                                return (
                                  <div className="bg-white p-3 border border-zinc-300 rounded-lg shadow-lg">
                                    <p className="font-semibold text-black">
                                      {data.name}
                                    </p>
                                    <p className="text-zinc-700">
                                      Amount:{" "}
                                      {formatCurrency(data.value as number)}
                                    </p>
                                    <p className="text-zinc-700">
                                      Percentage: {percentage}%
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getPieChartData().map((item, index) => {
                        const shortName = item.name
                          .replace(" Cost", "")
                          .replace(" Fee", "")
                          .replace(" Amount", "");
                        return (
                          <div
                            key={item.name}
                            className="flex flex-col items-center p-4 bg-white rounded-lg border-2 hover:shadow-md transition-shadow"
                            style={{
                              borderColor: COLORS[index % COLORS.length],
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="font-semibold text-black text-sm">
                                {shortName}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-zinc-800">
                                {formatCurrency(item.value)}
                              </div>
                              <div
                                className="text-xl font-bold mt-1"
                                style={{
                                  color: COLORS[index % COLORS.length],
                                }}
                              >
                                {item.percentage}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="bg-zinc-50 rounded-lg p-8 text-center text-zinc-500">
                    Enter product information to see cost breakdown
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
