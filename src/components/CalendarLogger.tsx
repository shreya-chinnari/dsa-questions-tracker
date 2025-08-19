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
      months.push(new Date(2025, i, 1));
    }
    return months;
  }, []);

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthName = monthDate.toLocaleString('default', { month: 'short' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const blanks = Array(firstDayOfWeek).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div key={`${year}-${month}`} className="bg-card p-3 rounded-lg shadow-md">
        <h3 className="text-md font-bold text-center mb-2">{monthName} {year}</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
          {days.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = dateLogs[dateStr] || 0;
            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(dateStr)}
                className={cn(
                  "w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
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
    <div className="mb-6">
      <h2 className="text-xl font-bold text-center mb-3">Daily Streak Logger</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {monthsToDisplay.map(month => renderMonth(month))}
      </div>
    </div>
  );
};

export default CalendarLogger;
