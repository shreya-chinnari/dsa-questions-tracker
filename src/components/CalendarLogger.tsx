"use client";

import { useMemo, Dispatch, SetStateAction } from 'react';
import { cn } from "@/lib/utils";

export type DateLog = {
  [date: string]: number;
};

type CalendarLoggerProps = {
  dateLogs: DateLog;
  setDateLogs: Dispatch<SetStateAction<DateLog>>;
};

const CalendarLogger = ({ dateLogs, setDateLogs }: CalendarLoggerProps) => {

  const handleDateClick = (date: string) => {
    setDateLogs(prevLogs => {
      const currentCount = prevLogs[date] || 0;
      const newCount = (currentCount + 1) % 10;
      const newLogs = { ...prevLogs };

      if (newCount === 0) {
        delete newLogs[date];
      } else {
        newLogs[date] = newCount;
      }
      return newLogs;
    });
  };

  const monthsToDisplay = useMemo(() => {
    const months = [];
    for (let i = 7; i <= 11; i++) { // August (7) to December (11)
      months.push(new Date(2026, i, 1));
    }
    return months;
  }, []);

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthName = monthDate.toLocaleString('default', { month: 'long' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const blanks = Array(firstDayOfWeek).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div key={`${year}-${month}`} className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-center mb-3">{monthName} {year}</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
          {days.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = dateLogs[dateStr] || 0;
            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                className={cn(
                  "w-full aspect-square rounded-md flex items-center justify-center text-xs sm:text-sm font-bold transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  count === 0 && 'bg-secondary hover:bg-secondary/80 text-muted-foreground',
                  {
                    'bg-green-200 text-green-800': count === 1,
                    'bg-green-300 text-green-900': count === 2,
                    'bg-green-400 text-green-900': count === 3,
                    'bg-yellow-200 text-yellow-800': count === 4,
                    'bg-yellow-300 text-yellow-900': count === 5,
                    'bg-yellow-400 text-yellow-900': count === 6,
                    'bg-red-200 text-red-800': count === 7,
                    'bg-red-300 text-red-900': count === 8,
                    'bg-red-400 text-red-900': count === 9,
                  }
                )}
              >
                {count > 0 ? count : day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">Daily Streak Logger</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthsToDisplay.map(month => renderMonth(month))}
      </div>
    </div>
  );
};

export default CalendarLogger;
