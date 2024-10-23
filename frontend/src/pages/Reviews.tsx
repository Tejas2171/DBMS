import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User, Package } from 'lucide-react'

// This would typically come from your API
const fetchReviews = async () => {
  // Simulating API call
  return [
    { review_id: 1, customer_id: 101, product_id: 201, rating: 5, review_text: "Great product!", review_date: '2023-05-01', customer_name: "John Doe", product_name: "Wireless Earbuds" },
    { review_id: 2, customer_id: 102, product_id: 202, rating: 4, review_text: "Good, but could be better", review_date: '2023-05-02', customer_name: "Jane Smith", product_name: "Smartwatch" },
    { review_id: 3, customer_id: 103, product_id: 203, rating: 3, review_text: "Average product", review_date: '2023-05-03', customer_name: "Bob Johnson", product_name: "Phone Case" },
    { review_id: 4, customer_id: 104, product_id: 204, rating: 5, review_text: "Excellent quality!", review_date: '2023-05-04', customer_name: "Alice Brown", product_name: "Laptop" },
    { review_id: 5, customer_id: 105, product_id: 205, rating: 2, review_text: "Not satisfied", review_date: '2023-05-05', customer_name: "Charlie Davis", product_name: "Bluetooth Speaker" },
  ]
}

const ratingColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  useEffect(() => {
    const getReviews = async () => {
      const fetchedReviews = await fetchReviews()
      setReviews(fetchedReviews)
      setFilteredReviews(fetchedReviews)
    }
    getReviews()
  }, [])

  useEffect(() => {
    const filtered = reviews.filter(review =>
      (review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       review.review_text.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (ratingFilter === 'all' || review.rating.toString() === ratingFilter)
    )
    setFilteredReviews(filtered)
  }, [searchTerm, ratingFilter, reviews])

  const getAverageRating = () => {
    const total = filteredReviews.reduce((sum, review) => sum + review.rating, 0)
    return filteredReviews.length > 0 ? (total / filteredReviews.length).toFixed(1) : 0
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[1, 2, 3, 4, 5].map(rating => (
              <SelectItem key={rating} value={rating.toString()}>{rating} Star</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reviews
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageRating()}</div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Review ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.review_id}>
                <TableCell>{review.review_id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {review.customer_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    {review.product_name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${ratingColors[review.rating]} text-white`}>
                    {review.rating} <Star className="ml-1 h-3 w-3" />
                  </Badge>
                </TableCell>
                <TableCell>{review.review_text}</TableCell>
                <TableCell>{review.review_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
