import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

interface DayData {
  date: Date;
  level: number;
  contributions: number;
  dayName: string;
  monthName: string;
}

export default function ContributionGrid() {
  const [hoveredCell, setHoveredCell] = useState<{
    data: DayData;
    x: number;
    y: number;
  } | null>(null);

  // Generate 52 weeks * 7 days stable random data representing coding activity
  const contributionData = useMemo(() => {
    const data: DayData[][] = [];
    const baseDate = new Date();
    
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Start 52 weeks ago (364 days ago)
    const startDate = new Date(baseDate.getTime() - 364 * 24 * 60 * 60 * 1000);

    // Grid alignment: 52 columns (weeks), each with 7 rows (days)
    for (let w = 0; w < 52; w++) {
      const week: DayData[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate.getTime() + (w * 7 + d) * 24 * 60 * 60 * 1000);

        // Random level mapping
        // Higher probability for empty/low days, occasional high bursts
        const randomVal = Math.random();
        let level = 0;
        let contributions = 0;

        if (randomVal > 0.98) {
          level = 4;
          contributions = Math.floor(Math.random() * 8) + 12; // 12-19 contributions
        } else if (randomVal > 0.94) {
          level = 3;
          contributions = Math.floor(Math.random() * 5) + 7;  // 7-11 contributions
        } else if (randomVal > 0.88) {
          level = 2;
          contributions = Math.floor(Math.random() * 4) + 3;  // 3-6 contributions
        } else if (randomVal > 0.75) {
          level = 1;
          contributions = Math.floor(Math.random() * 2) + 1;  // 1-2 contributions
        }

        week.push({
          date: currentDate,
          level,
          contributions,
          dayName: weekdayNames[currentDate.getUTCDay()],
          monthName: monthNames[currentDate.getUTCMonth()],
        });
      }
      data.push(week);
    }
    return data;
  }, []);

  // Map intensity levels (0-4) to colors exactly as requested
  const getLevelColorClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700';
      case 1:
        return 'bg-green-100 dark:bg-green-900/60 text-green-800'; // light level 1
      case 2:
        return 'bg-green-300 dark:bg-green-700 text-green-900'; // level 2
      case 3:
        return 'bg-green-500 dark:bg-green-500'; // level 3
      case 4:
        return 'bg-green-700 dark:bg-green-300'; // level 4
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  // Find where months transition to display labels above
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = '';

    contributionData.forEach((week, index) => {
      const month = week[0].monthName;
      if (month !== lastMonth && index % 4 === 0) {
        labels.push({ text: month, colIndex: index });
        lastMonth = month;
      }
    });
    return labels;
  }, [contributionData]);

  // Handle cell mouse-over details
  const handleMouseEnter = (event: React.MouseEvent, day: DayData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = event.currentTarget.closest('#grid-wrapper')?.getBoundingClientRect();

    if (container) {
      setHoveredCell({
        data: day,
        x: rect.left - container.left + rect.width / 2,
        y: rect.top - container.top - 42,
      });
    }
  };

  return (
    <div id="contribution-card" className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 ml-1 rounded-lg bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-sans">
              The Days I Code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              My coding activity over the past year (364 days)
            </p>
          </div>
        </div>

        {/* Color Legend Indicators */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
          <span className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <span className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <span className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <span className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300" />
          <span>More</span>
        </div>
      </div>

      {/* Grid wrapper with horizontal scrolling on mobile */}
      <div className="w-full overflow-x-auto relative scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" id="scroll-container">
        <div className="min-w-[720px] pb-3 pt-6 px-1 relative" id="grid-wrapper">

          {/* Month Labels row */}
          <div className="absolute top-0 left-8 flex text-[10px] font-mono text-slate-400 font-semibold uppercase leading-none">
            {monthLabels.map((lbl, idx) => (
              <span
                key={idx}
                style={{ marginLeft: idx === 0 ? `${lbl.colIndex * 13}px` : `${(lbl.colIndex - monthLabels[idx - 1].colIndex) * 13 - 18}px` }}
                className="inline-block"
              >
                {lbl.text}
              </span>
            ))}
          </div>

          {/* Core Grid Matrix layout */}
          <div className="flex select-none">
            {/* Weekday labels channel on left */}
            <div className="flex flex-col gap-[3px] pr-2 justify-between text-[10px] font-mono text-slate-400 font-bold h-[102px] pt-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix columns mapping */}
            <div className="flex gap-[3px]">
              {contributionData.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, rowIdx) => (
                    <div
                      key={rowIdx}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-[12px] h-[12px] rounded-sm transition-transform duration-200 cursor-pointer ${getLevelColorClass(day.level)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Hover Custom Floating Tooltip */}
          {hoveredCell && (
            <div
              style={{
                left: `${hoveredCell.x}px`,
                top: `${hoveredCell.y}px`,
              }}
              className="absolute bg-slate-900 border border-slate-700 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-lg -translate-x-1/2 flex items-center gap-1.5 shadow-xl pointer-events-none z-30 transition-all duration-150 animate-bounce"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span>
                <strong>{hoveredCell.data.contributions} contributions</strong> on {hoveredCell.data.dayName}, {hoveredCell.data.monthName} {hoveredCell.data.date.getUTCDate()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
