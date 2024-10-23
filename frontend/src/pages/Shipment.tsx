import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Truck, Package, Search } from 'lucide-react'

// This would typically come from your API
const fetchShipments = async () => {
  // Simulating API call
  return [
    { shipment_id: 1, order_id: 101, shipment_date: new Date('2023-05-01'), carrier: 'FedEx', tracking_number: 'FX123456789' },
    { shipment_id: 2, order_id: 102, shipment_date: new Date('2023-05-02'), carrier: 'UPS', tracking_number: 'UP987654321' },
    { shipment_id: 3, order_id: 103, shipment_date: new Date('2023-05-03'), carrier: 'DHL', tracking_number: 'DH456789123' },
    { shipment_id: 4, order_id: 104, shipment_date: new Date('2023-05-04'), carrier: 'USPS', tracking_number: 'US789123456' },
    { shipment_id: 5, order_id: 105, shipment_date: new Date('2023-05-05'), carrier: 'FedEx', tracking_number: 'FX987654321' },
  ]
}

const carrierColors = {
  'FedEx': 'bg-purple-500',
  'UPS': 'bg-yellow-500',
  'DHL': 'bg-red-500',
  'USPS': 'bg-blue-500',
}

export default function Shipments() {
  const [shipments, setShipments] = useState([])
  const [filteredShipments, setFilteredShipments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newShipment, setNewShipment] = useState({ order_id: '', carrier: '', tracking_number: '' })

  useEffect(() => {
    const getShipments = async () => {
      const fetchedShipments = await fetchShipments()
      setShipments(fetchedShipments)
      setFilteredShipments(fetchedShipments)
    }
    getShipments()
  }, [])

  useEffect(() => {
    const filtered = shipments.filter(shipment =>
      (shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
       shipment.order_id.toString().includes(searchTerm)) &&
      (carrierFilter === 'all' || shipment.carrier === carrierFilter)
    )
    setFilteredShipments(filtered)
  }, [searchTerm, carrierFilter, shipments])

  const handleAddShipment = () => {
    const shipmentToAdd = {
      shipment_id: shipments.length + 1,
      ...newShipment,
      shipment_date: new Date(),
      order_id: parseInt(newShipment.order_id)
    }
    setShipments([...shipments, shipmentToAdd])
    setNewShipment({ order_id: '', carrier: '', tracking_number: '' })
    setIsAddDialogOpen(false)
  }

  const carriers = [...new Set(shipments.map(shipment => shipment.carrier))]

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Package className="mr-2 h-4 w-4" /> Add Shipment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Shipment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-id" className="text-right">Order ID</Label>
                <Input
                  id="order-id"
                  value={newShipment.order_id}
                  onChange={(e) => setNewShipment({...newShipment, order_id: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carrier" className="text-right">Carrier</Label>
                <Select onValueChange={(value) => setNewShipment({...newShipment, carrier: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tracking-number" className="text-right">Tracking Number</Label>
                <Input
                  id="tracking-number"
                  value={newShipment.tracking_number}
                  onChange={(e) => setNewShipment({...newShipment, tracking_number: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddShipment}>Add Shipment</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
        <Input
          placeholder="Search by tracking number or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={carrierFilter} onValueChange={setCarrierFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Carriers</SelectItem>
            {carriers.map((carrier) => (
              <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredShipments.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Shipment Date</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.shipment_id}>
                <TableCell>{shipment.shipment_id}</TableCell>
                <TableCell>{shipment.order_id}</TableCell>
                <TableCell>{shipment.shipment_date.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={`${carrierColors[shipment.carrier]} text-white`}>
                    {shipment.carrier}
                  </Badge>
                </TableCell>
                <TableCell>{shipment.tracking_number}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Track Shipment</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
