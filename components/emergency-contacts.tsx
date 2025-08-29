"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Phone, Mail, User, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  email: string
  relationship: string
}

interface EmergencyContactsProps {
  onBack: () => void
}

export function EmergencyContacts({ onBack }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  })
  const { toast } = useToast()

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("digital-lawyer-emergency-contacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem("digital-lawyer-emergency-contacts", JSON.stringify(contacts))
  }, [contacts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone number are required.",
        variant: "destructive",
      })
      return
    }

    if (editingId) {
      // Update existing contact
      setContacts((prev) => prev.map((contact) => (contact.id === editingId ? { ...contact, ...formData } : contact)))
      toast({
        title: "Contact Updated",
        description: `${formData.name} has been updated successfully.`,
      })
      setEditingId(null)
    } else {
      // Add new contact
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...formData,
      }
      setContacts((prev) => [...prev, newContact])
      toast({
        title: "Contact Added",
        description: `${formData.name} has been added to your emergency contacts.`,
      })
    }

    setFormData({ name: "", phone: "", email: "", relationship: "" })
    setIsAdding(false)
  }

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      relationship: contact.relationship,
    })
    setEditingId(contact.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    const contact = contacts.find((c) => c.id === id)
    setContacts((prev) => prev.filter((c) => c.id !== id))
    toast({
      title: "Contact Removed",
      description: `${contact?.name} has been removed from your emergency contacts.`,
    })
  }

  const handleCancel = () => {
    setFormData({ name: "", phone: "", email: "", relationship: "" })
    setEditingId(null)
    setIsAdding(false)
  }

  const testNotification = (contact: EmergencyContact) => {
    toast({
      title: "Test Notification Sent",
      description: `Test notification sent to ${contact.name} at ${contact.phone}`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Phone className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Emergency Contacts</h1>
              <p className="text-sm text-muted-foreground">Manage your emergency contact list</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Info Card */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold">About Emergency Contacts</h3>
                  <p className="text-sm text-muted-foreground">
                    These contacts will be automatically notified when you use the incident capture feature for serious
                    situations. Make sure to add trusted family members, friends, or colleagues who should be informed
                    in case of emergencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Contact Button */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} className="w-full" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Emergency Contact
            </Button>
          )}

          {/* Add/Edit Contact Form */}
          {isAdding && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Contact" : "Add New Contact"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update the contact information" : "Enter the details for your emergency contact"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={formData.relationship}
                        onChange={(e) => setFormData((prev) => ({ ...prev, relationship: e.target.value }))}
                        placeholder="Spouse, Parent, Friend, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingId ? "Update Contact" : "Add Contact"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Contacts List */}
          {contacts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Emergency Contacts</h2>
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                          <User className="h-5 w-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{contact.name}</h3>
                          {contact.relationship && (
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => testNotification(contact)}>
                          Test
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {contacts.length === 0 && !isAdding && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Phone className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Emergency Contacts</h3>
                <p className="text-muted-foreground mb-4">
                  Add emergency contacts to be automatically notified during incident capture.
                </p>
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
