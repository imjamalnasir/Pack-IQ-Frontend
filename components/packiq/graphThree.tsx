"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { quarter: "Q1", cost2023: 8200, cost2024: 9500 },
  { quarter: "Q2", cost2023: 11000, cost2024: 12500 },
  { quarter: "Q3", cost2023: 9000, cost2024: 14000 },
  { quarter: "Q4", cost2023: 15000, cost2024: 17000 },
]

export function GraphThree() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="quarter" />

          <YAxis
            domain={[0, 18000]}
            ticks={[0, 4500, 9000, 13500, 18000]}
          />

          <Tooltip />

          <Bar
            dataKey="cost2023"
            fill="#94a3b8"
            name="2023"
            radius={[4, 4, 0, 0]}
          />

          <Bar
            dataKey="cost2024"
            fill="#2563eb"
            name="2024"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
