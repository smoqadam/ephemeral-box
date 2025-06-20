"use client";

import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (op: string) => {
    if (op === "=") {
      performOperation("=");
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    } else {
      performOperation(op);
    }
  };

  const Button = ({ onClick, className = "", children, ...props }: any) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg font-semibold text-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-sm mx-auto bg-slate-100 p-6 rounded-xl">
      {/* Display */}
      <div className="bg-slate-800 text-white p-4 rounded-lg mb-4 text-right">
        <div className="text-3xl font-mono overflow-hidden">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button
          onClick={clear}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
        >
          Clear
        </Button>
        <Button
          onClick={() => handleOperation("÷")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          ÷
        </Button>
        <Button
          onClick={() => handleOperation("×")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          ×
        </Button>

        {/* Row 2 */}
        <Button
          onClick={() => inputNumber("7")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          7
        </Button>
        <Button
          onClick={() => inputNumber("8")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          8
        </Button>
        <Button
          onClick={() => inputNumber("9")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          9
        </Button>
        <Button
          onClick={() => handleOperation("-")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          -
        </Button>

        {/* Row 3 */}
        <Button
          onClick={() => inputNumber("4")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          4
        </Button>
        <Button
          onClick={() => inputNumber("5")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          5
        </Button>
        <Button
          onClick={() => inputNumber("6")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          6
        </Button>
        <Button
          onClick={() => handleOperation("+")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          +
        </Button>

        {/* Row 4 */}
        <Button
          onClick={() => inputNumber("1")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          1
        </Button>
        <Button
          onClick={() => inputNumber("2")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          2
        </Button>
        <Button
          onClick={() => inputNumber("3")}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          3
        </Button>
        <Button
          onClick={() => handleOperation("=")}
          className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          =
        </Button>

        {/* Row 5 */}
        <Button
          onClick={() => inputNumber("0")}
          className="col-span-2 bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          0
        </Button>
        <Button
          onClick={inputDecimal}
          className="bg-slate-300 hover:bg-slate-400 text-slate-800"
        >
          .
        </Button>
      </div>
    </div>
  );
}
