import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import React from 'react'

const CustomChart = () => {
    const chartData = [
        { browser: "safari", visitors: "65%", fill: "var(--color-safari)" },
      ]
    const chartConfig = {
        visitors: {
          label: "Space Used",
        },
        safari: {
          label: "Safari",
          color: "white",
        },
      }
    return (
        <Card className="flex flex-row bg-[#fa7275] items-center justify-center px-3">
          
            <CardContent className="flex-1 pb-0 bg-[#fa7275]">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square bg-[#fa7275]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={270}
                        endAngle={0}
                        innerRadius={90}
                        outerRadius={140}
                    >
                        
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="fill-none bg-none"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-white text-4xl font-bold"
                                                >
                                                    {chartData[0].visitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-white text-base "
                                                >
                                                    Space Used
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <div className="text-white flex-col ">
                <div className="font-semibold">
                Available Storage
                </div>
                <div>
                    82/128 GB
                </div>
            </div>
        </Card>
    )
}

export default CustomChart