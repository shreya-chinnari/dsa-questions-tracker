"use client";

import { useState, useEffect } from 'react';
import usePersistentState from '@/hooks/usePersistentState';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CalendarLogger, { DateLog } from '@/components/CalendarLogger';

export default function Home() {
  const [days, setDays] = useState(0);
  const [dsa, setDsa] = useState(0);
  const [dateLogs, setDateLogs] = usePersistentState<DateLog>('dateLogs', {});

  const [daysLeft, setDaysLeft] = useState(0);
  const [yearProgress, setYearProgress] = useState(0);

  useEffect(() => {
    const calculateTimeValues = () => {
      const today = new Date();
      const endOfYear = new Date('2025-12-31T23:59:59');
      const startOfYear = new Date('2025-01-01T00:00:00');

      if (today > endOfYear) {
        setDaysLeft(0);
        setYearProgress(100);
        return;
      }
      if (today < startOfYear) {
        const totalDaysInYear = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
        setDaysLeft(Math.ceil(totalDaysInYear));
        setYearProgress(0);
        return;
      }

      const diffTime = endOfYear.getTime() - today.getTime();
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDaysLeft(diffDays);

      const totalTime = endOfYear.getTime() - startOfYear.getTime();
      const elapsedTime = today.getTime() - startOfYear.getTime();
      const progress = Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100));
      setYearProgress(progress);
    };

    calculateTimeValues();
    const interval = setInterval(calculateTimeValues, 60000); 

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const totalDsa = Object.values(dateLogs).reduce((sum, count) => sum + count, 0);
    const totalDays = Object.keys(dateLogs).filter(key => dateLogs[key] > 0).length;
    setDsa(totalDsa);
    setDays(totalDays);
  }, [dateLogs]);


  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight font-headline">3-4 DSA questions daily</h1>
          <p className="text-muted-foreground mt-2 text-lg">imageine how good you'll be by the end of the year</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-lg border-none bg-coral text-coral-foreground rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">📅 Days Logged</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-extrabold">
                        <AnimatedCounter value={days} />
                    </div>
                    <p className="text-xs text-coral-foreground/70 mt-3">Total days with logged questions</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-teal text-teal-foreground rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">📘 DSA Solved</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-extrabold">
                        <AnimatedCounter value={dsa} />
                    </div>
                     <p className="text-xs text-teal-foreground/70 mt-3">Total questions solved from calendar</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-yellow-vibrant text-yellow-vibrant-foreground rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">⏳ Days Left in 2025</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-6xl font-extrabold">
                        <AnimatedCounter value={daysLeft} />
                    </div>
                    <p className="text-xs text-yellow-vibrant-foreground/70 mt-3">Until December 31, 2025</p>
                </CardContent>
            </Card>
        </div>

        <CalendarLogger dateLogs={dateLogs} setDateLogs={setDateLogs} />
        
        <div className="mt-12 bg-card p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">2025 Year Progress</h2>
            <div className="max-w-3xl mx-auto">
                <Progress value={yearProgress} className="h-4" />
                <p className="text-center text-muted-foreground mt-2 font-medium">{yearProgress.toFixed(1)}% complete</p>
            </div>
        </div>
      </div>
    </main>
  );
}
