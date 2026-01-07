import { useState } from 'react';
import { X, Delete } from 'lucide-react';

export default function Calculator({ isOpen, onClose }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  if (!isOpen) return null;

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Calculator Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Hesap Makinesi</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Display */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white rounded-lg p-4 text-right">
            {operation && previousValue !== null && (
              <div className="text-xs text-gray-400 mb-1">
                {previousValue} {operation}
              </div>
            )}
            <div className="text-3xl font-bold text-gray-800 break-all">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4">
          {/* Top controls */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={handleClear}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Delete className="w-4 h-4" />
              Sil
            </button>
          </div>

          {/* Number and operation buttons */}
          {buttons.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              {row.map((btn) => {
                const isOperation = ['÷', '×', '-', '+'].includes(btn);
                const isEquals = btn === '=';
                const isZero = btn === '0';

                return (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '=') handleEquals();
                      else if (btn === '.') handleDecimal();
                      else if (isOperation) handleOperation(btn);
                      else handleNumber(btn);
                    }}
                    className={`
                      p-3 rounded-lg font-semibold transition-colors
                      ${isOperation
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : isEquals
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }
                      ${isZero ? 'col-span-2' : ''}
                    `}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
