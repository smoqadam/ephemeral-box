"use client";

import { useState } from "react";

type ConversionCategory = {
  name: string;
  units: { [key: string]: { name: string; factor: number } };
};

const categories: ConversionCategory[] = [
  {
    name: "Length",
    units: {
      mm: { name: "Millimeters", factor: 1 },
      cm: { name: "Centimeters", factor: 10 },
      m: { name: "Meters", factor: 1000 },
      km: { name: "Kilometers", factor: 1000000 },
      in: { name: "Inches", factor: 25.4 },
      ft: { name: "Feet", factor: 304.8 },
      yd: { name: "Yards", factor: 914.4 },
      mi: { name: "Miles", factor: 1609344 },
    },
  },
  {
    name: "Weight",
    units: {
      mg: { name: "Milligrams", factor: 1 },
      g: { name: "Grams", factor: 1000 },
      kg: { name: "Kilograms", factor: 1000000 },
      oz: { name: "Ounces", factor: 28349.5 },
      lb: { name: "Pounds", factor: 453592 },
    },
  },
  {
    name: "Temperature",
    units: {
      c: { name: "Celsius", factor: 1 },
      f: { name: "Fahrenheit", factor: 1 },
      k: { name: "Kelvin", factor: 1 },
    },
  },
  {
    name: "Volume",
    units: {
      ml: { name: "Milliliters", factor: 1 },
      l: { name: "Liters", factor: 1000 },
      gal: { name: "Gallons", factor: 3785.41 },
      qt: { name: "Quarts", factor: 946.353 },
      pt: { name: "Pints", factor: 473.176 },
      cup: { name: "Cups", factor: 236.588 },
      fl_oz: { name: "Fluid Ounces", factor: 29.5735 },
    },
  },
];

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [fromUnit, setFromUnit] = useState(Object.keys(categories[0].units)[0]);
  const [toUnit, setToUnit] = useState(Object.keys(categories[0].units)[1]);
  const [inputValue, setInputValue] = useState("1");
  const [result, setResult] = useState("0");

  const convertValue = (value: string, from: string, to: string, category: ConversionCategory) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0";

    if (category.name === "Temperature") {
      return convertTemperature(numValue, from, to).toFixed(4);
    }

    const fromFactor = category.units[from].factor;
    const toFactor = category.units[to].factor;
    const baseValue = numValue * fromFactor;
    const convertedValue = baseValue / toFactor;
    
    return convertedValue.toFixed(4);
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === "f") {
      celsius = (value - 32) * 5/9;
    } else if (from === "k") {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === "f") {
      return celsius * 9/5 + 32;
    } else if (to === "k") {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  const handleCategoryChange = (category: ConversionCategory) => {
    setSelectedCategory(category);
    const units = Object.keys(category.units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleConvert = () => {
    const converted = convertValue(inputValue, fromUnit, toUnit, selectedCategory);
    setResult(converted);
  };

  // Auto-convert when values change
  useState(() => {
    handleConvert();
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Unit Converter</h1>
      
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryChange(category)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory.name === category.name
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Interface */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg mb-3"
            >
              {Object.entries(selectedCategory.units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                const converted = convertValue(e.target.value, fromUnit, toUnit, selectedCategory);
                setResult(converted);
              }}
              className="w-full p-3 border border-slate-300 rounded-lg text-lg"
              placeholder="Enter value"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                const converted = convertValue(inputValue, fromUnit, e.target.value, selectedCategory);
                setResult(converted);
              }}
              className="w-full p-3 border border-slate-300 rounded-lg mb-3"
            >
              {Object.entries(selectedCategory.units).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name}
                </option>
              ))}
            </select>
            <div className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-lg font-mono">
              {result}
            </div>
          </div>
        </div>

        {/* Conversion Display */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center text-slate-700">
            <span className="font-semibold">{inputValue} {selectedCategory.units[fromUnit].name}</span>
            {" = "}
            <span className="font-semibold text-blue-600">{result} {selectedCategory.units[toUnit].name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
