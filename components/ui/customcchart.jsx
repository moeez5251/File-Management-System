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
import { Client, Storage, Account } from 'appwrite';
const CustomChart = () => {
    const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
    const storage = new Storage(client);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        (async function fetchStorageUsage() {
            const accountId = localStorage.getItem("accountid");

            try {
                const response = await storage.listFiles(
                    process.env.NEXT_PUBLIC_BUCKET_ID
                );
                const filteredFiles = response.files.filter(file => {
                    const match = file.$permissions[0].match(/user:([a-zA-Z0-9]+)/);
                    return match && match[1] === accountId;
                });


                const totalspace = filteredFiles.reduce((total, file) => total + file.sizeOriginal, 0);
                const totalBytes = 2 * 1073741824; // 2GB in bytes

                const per = totalspace > 0 ? ((totalspace / totalBytes) * 100).toFixed(2) : "0";
                setPercentage(Number(per));
            } catch (error) {
                setPercentage(0);
            }
        })();
    }, []);

    const chartData = [{ name: "Used Space", value: percentage, fill: "#fff" }];

    return (
        <Card className="flex flex-row bg-[#fa7275] items-center gap-3 md:gap-6 justify-center px-1 md:px-4 py-6 shadow-2xl">
            <CardContent className="flex-1 pb-0 bg-[#fa7275] flex items-center justify-center">
                <div className="relative">
                    <RadialBarChart
                        width={170}
                        height={170}
                        innerRadius={80}
                        outerRadius={130}
                        startAngle={270}
                        endAngle={percentage ? 270 - (percentage / 100) * 360 : 270} // Prevent NaN
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
                                                    {percentage}%
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

