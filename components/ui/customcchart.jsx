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
} from "@/components/ui/card"
import React from 'react'

const CustomChart = () => {
    const percentage = 10; 
    const chartData = [{ name: "Used Space", value: percentage, fill: "#fff" }];
    return (
        <Card className="flex flex-row bg-[#fa7275] items-center justify-center px-4 py-6 shadow-2xl">
            <CardContent className="flex-1 pb-0 bg-[#fa7275] flex items-center justify-center">
                <div className="relative">
                    <RadialBarChart
                        width={170} 
                        height={170} 
                        innerRadius={80} // ✅ Same for both
                        outerRadius={130} // ✅ Same for both
                        startAngle={270}
                        endAngle={270 - (percentage / 100) * 360} // ✅ Dynamic end angle
                        data={chartData}
                    >


                        <RadialBar
                            data={chartData}
                            dataKey="value"
                            cornerRadius={30}
                            barSize={10} // ✅ SAME size for proper positioning
                        />

                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox?.cx && viewBox?.cy) {
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
                                                    {percentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy + 24}
                                                    className="fill-white text-lg"
                                                >
                                                    Used
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </div>
            </CardContent>

            <div className="text-white flex flex-col">
                <div className="font-semibold text-base">Available Storage</div>
                <div className="text-lg">82/128 GB</div>
            </div>
        </Card>
    );
}

export default CustomChart;
