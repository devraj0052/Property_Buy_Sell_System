'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState<number>(500000);
  const [rate, setRate] = useState<number>(6.5);
  const [years, setYears] = useState<number>(20);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, years]);

  const calculateEMI = () => {
    const p = principal;
    const r = rate / 12 / 100; // monthly interest rate
    const n = years * 12; // total number of months

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emiValue * n;
      const interest = totalAmount - p;

      setEmi(Math.round(emiValue));
      setTotalPayment(Math.round(totalAmount));
      setTotalInterest(Math.round(interest));
    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            EMI & Loan <span className="text-primary">Calculator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Estimate your monthly mortgage payments with our easy-to-use calculator. Plan your property investment efficiently.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 glass dark:glass-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Loan Details</h2>
            
            <div className="space-y-8">
              {/* Principal Input */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> Loan Amount
                  </label>
                  <span className="text-slate-900 dark:text-white font-bold">${principal.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="5000000" 
                  step="10000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$50k</span>
                  <span>$5M+</span>
                </div>
              </div>

              {/* Interest Rate Input */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4 text-secondary" /> Interest Rate
                  </label>
                  <span className="text-slate-900 dark:text-white font-bold">{rate}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-secondary"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Loan Tenure Input */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Loan Tenure
                  </label>
                  <span className="text-slate-900 dark:text-white font-bold">{years} Years</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>5 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 lg:w-[400px] shrink-0"
          >
            <div className="bg-primary rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-primary/30 h-full flex flex-col justify-center">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10 text-center mb-8">
                <p className="text-slate-900 dark:text-white/80 text-lg font-medium mb-2">Equated Monthly Installment</p>
                <div className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight flex justify-center items-start gap-1">
                  <span className="text-3xl mt-2">$</span>
                  {emi.toLocaleString()}
                </div>
              </div>

              <div className="relative z-10 space-y-4 border-t border-white/20 pt-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 dark:text-white/80">Principal Amount</span>
                  <span className="text-slate-900 dark:text-white font-bold text-lg">${principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 dark:text-white/80">Total Interest</span>
                  <span className="text-slate-900 dark:text-white font-bold text-lg">${totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                  <span className="text-slate-900 dark:text-white font-medium">Total Amount Payable</span>
                  <span className="text-slate-900 dark:text-white font-bold text-xl">${totalPayment.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="relative z-10 w-full mt-10 bg-white text-primary hover:bg-slate-100 rounded-xl py-4 font-bold text-lg transition-colors">
                Apply for Loan
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
