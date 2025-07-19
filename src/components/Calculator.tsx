import { useState } from 'react';
import { Delete, Equal } from 'lucide-react';

interface CalculatorProps {
  onAmountChange: (amount: number) => void;
  currentAmount: number;
}

export default function Calculator({ onAmountChange, currentAmount }: CalculatorProps) {
  const [display, setDisplay] = useState(currentAmount.toString());
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    onAmountChange(0);
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
      onAmountChange(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      onAmountChange(newValue);
    } else {
      onAmountChange(inputValue);
    }
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500 hover:bg-red-600 text-white col-span-2' },
    { label: '⌫', action: () => {
      if (display.length > 1) {
        const newDisplay = display.slice(0, -1);
        setDisplay(newDisplay);
        onAmountChange(parseFloat(newDisplay) || 0);
      } else {
        setDisplay('0');
        onAmountChange(0);
      }
    }, className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { label: '/', action: () => performOperation('/'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '*', action: () => performOperation('*'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '-', action: () => performOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '+', action: () => performOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '0', action: () => inputNumber('0'), className: 'bg-gray-200 hover:bg-gray-300 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '=', action: handleEquals, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-xs">
      <div className="mb-4">
        <div className="bg-gray-100 rounded p-3 text-right text-xl font-mono">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={`p-3 rounded font-medium transition-colors ${button.className}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}