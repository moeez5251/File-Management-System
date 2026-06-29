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
import React, { useEffect, useState } from 'react'
const CustomChart = ({ total, used }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const percentage = total && typeof used === 'number' ? (used / total) * 100 : 0;
    const chartData = [{ name: "Used Space", value: percentage, fill: "#fff" }];

    return (
        <Card className="flex flex-row bg-[#fa7275] items-center gap-3 md:gap-6 justify-center px-1 md:px-4 py-6 shadow-2xlz">
            <CardContent className="flex-1 pb-0 bg-[#fa7275] flex items-center justify-center">
                <div className="relative w-[170px] h-[170px] flex items-center justify-center">
                    {isMounted ? (
                        <RadialBarChart
                            width={170}
                            height={170}
                            innerRadius={80}
                            outerRadius={130}
                            startAngle={270}
                            endAngle={percentage ? 270 - (percentage / 100) * 360 : 270}
                            data={chartData}
                        >
                            <RadialBar
                                data={chartData}
                                dataKey="value"
                                cornerRadius={30}
                                barSize={10}
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
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-4xl font-bold">
                                                        {percentage.toFixed(1)}%
                                                    </tspan>
                                                    <tspan x={viewBox.cx} y={viewBox.cy + 24} className="fill-white text-lg">
                                                        Used
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    ) : (
                        <div className="w-[170px] h-[170px]" />
                    )}
                </div>
            </CardContent>

            <div className="text-white flex flex-col">
                <div className="font-semibold text-base">Available Storage</div>
                <div className="text-lg">{((percentage / 100) * 2).toFixed(2)} GB/2 GB</div>
            </div>
        </Card>
    );
};

export default CustomChart;

