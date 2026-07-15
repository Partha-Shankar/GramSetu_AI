import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, LineChart, TrendingUp, HelpCircle } from 'lucide-react';
import { Campaign, WardScore } from '../types';

interface ProgressChartsProps {
  wards: WardScore[];
  campaigns: Campaign[];
  villageScore: number;
}

export function ProgressCharts({ wards, campaigns, villageScore }: ProgressChartsProps) {
  // --- 1. Weekly Progress (Mon - Sun) ---
  // Sunday reflects the live villageScore
  const weeklyData = [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 73 },
    { day: 'Thu', score: 77 },
    { day: 'Fri', score: 80 },
    { day: 'Sat', score: 84 },
    { day: 'Sun', score: villageScore },
  ];

  // SVG parameters for Weekly Chart
  const weeklyWidth = 500;
  const weeklyHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = weeklyWidth - paddingX * 2;
  const graphHeight = weeklyHeight - paddingY * 2;

  // --- 2. Monthly Trend (Area Chart) ---
  const monthlyData = [
    { month: 'Feb', score: 62 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 70 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 81 },
    { month: 'Jul', score: villageScore },
  ];

  // SVG parameters for Monthly Chart
  const monthlyWidth = 500;
  const monthlyHeight = 220;

  // Construct points for area line
  const points = monthlyData.map((d, index) => {
    const x = paddingX + (index * graphWidth) / (monthlyData.length - 1);
    const y = paddingY + graphHeight - (d.score / 100) * graphHeight;
    return { x, y, score: d.score, label: d.month };
  });

  // Create path strings
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingY + graphHeight} L ${points[0].x} ${paddingY + graphHeight} Z`
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Weekly Progress Index */}
      <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs">
        <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Weekly Cleanliness Index
              </CardTitle>
              <CardDescription className="text-[11px]">
                Daily compliance tracker (Mon - Sun)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full overflow-hidden">
            <svg
              className="w-full h-auto text-neutral-350 dark:text-neutral-600"
              viewBox={`0 0 ${weeklyWidth} ${weeklyHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(val => {
                const y = paddingY + graphHeight - (val / 100) * graphHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={weeklyWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.25"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fill="currentColor"
                      fontSize="10"
                      textAnchor="end"
                      className="fill-neutral-450 dark:fill-neutral-500 font-medium"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Vertical Bars */}
              {weeklyData.map((d, i) => {
                const barWidth = 28;
                const x = paddingX + (i * graphWidth) / (weeklyData.length - 1) - barWidth / 2;
                const barHeight = (d.score / 100) * graphHeight;
                const y = paddingY + graphHeight - barHeight;

                const isSunday = d.day === 'Sun';

                return (
                  <g key={d.day} className="group">
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 4)}
                      rx="4"
                      fill={isSunday ? 'url(#activeBlueGrad)' : 'url(#normalBlueGrad)'}
                      className="transition-all duration-300 hover:opacity-90"
                    />
                    {/* Bar label score */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="currentColor"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      className="fill-neutral-800 dark:fill-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {d.score}%
                    </text>
                    {/* Day label */}
                    <text
                      x={x + barWidth / 2}
                      y={weeklyHeight - 10}
                      fill="currentColor"
                      fontSize="10.5"
                      fontWeight="600"
                      textAnchor="middle"
                      className="fill-neutral-500 dark:fill-neutral-450"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="normalBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="activeBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Monthly Trend */}
      <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs">
        <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Monthly Progress Curve
              </CardTitle>
              <CardDescription className="text-[11px]">
                Six-month sanitation index projection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full overflow-hidden">
            <svg
              className="w-full h-auto text-neutral-350 dark:text-neutral-600"
              viewBox={`0 0 ${monthlyWidth} ${monthlyHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(val => {
                const y = paddingY + graphHeight - (val / 100) * graphHeight;
                return (
                  <line
                    key={val}
                    x1={paddingX}
                    y1={y}
                    x2={monthlyWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.25"
                  />
                );
              })}

              {/* Area Gradient Fill */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill="url(#indigoGradFill)"
                  opacity="0.15"
                />
              )}

              {/* Line Path */}
              {linePath && (
                <path
                  d={linePath}
                  stroke="url(#lineIndigoGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all duration-150"
                  />
                  {/* Point tooltips */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    fill="#1e1b4b"
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                    className="fill-neutral-900 dark:fill-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {p.score}%
                  </text>
                  {/* Month labels */}
                  <text
                    x={p.x}
                    y={monthlyHeight - 10}
                    fill="currentColor"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    className="fill-neutral-500 dark:fill-neutral-450"
                  >
                    {p.label}
                  </text>
                </g>
              ))}

              {/* Gradients */}
              <defs>
                <linearGradient id="indigoGradFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineIndigoGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>
      
      {/* Chart 3: Ward Comparative Scores */}
      <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs lg:col-span-2">
        <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Ward Comparison Graph
              </CardTitle>
              <CardDescription className="text-[11px]">
                Cleanliness Index compared side-by-side
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {wards.map(ward => (
              <div key={ward.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">{ward.name}</span>
                  <span className="text-neutral-900 dark:text-neutral-100">{ward.score}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${ward.score}%` }}
                  />
                  <div
                    className="bg-neutral-200 dark:bg-neutral-700 h-full flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
