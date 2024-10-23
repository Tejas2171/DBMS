import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis,  Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Mock data for demonstration
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
]

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Books', value: 200 },
  { name: 'Home & Garden', value: 278 },
  { name: 'Sports', value: 189 },
]

const customerData = [
  { month: 'Jan', new: 400, returning: 240 },
  { month: 'Feb', new: 300, returning: 139 },
  { month: 'Mar', new: 500, returning: 380 },
  { month: 'Apr', new: 450, returning: 430 },
  { month: 'May', new: 600, returning: 520 },
  { month: 'Jun', new: 550, returning: 490 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Reports() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Overview of sales performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="sales" fill="var(--color-sales)" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                category: {
                  label: "Category",
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>New vs Returning Customers over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={{
                new: {
                  label: "New Customers",
                  color: "hsl(var(--chart-1))",
                },
                returning: {
                  label: "Returning Customers",
                  color: "hsl(var(--chart-2))",
                },
              }} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="new" stroke="var(--color-new)" name="New Customers" />
                    <Line type="monotone" dataKey="returning" stroke="var(--color-returning)" name="Returning Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}