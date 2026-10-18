"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, AlertTriangle, Lightbulb } from "lucide-react"

export default function CreatePowerThoughtPage() {
  const [thought, setThought] = useState("")
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false)\n  const [status, setStatus] = useState<"draft" | "published">("draft")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/power-thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought, date: date, status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Power thought created successfully",
        })
        router.push("/dashboard/power-thoughts")
      } else {
        toast({
          title: "Error",
          description: "Failed to create power thought",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Power Thought</h2>
          <p className="text-muted-foreground">Share an inspirational thought</p>
        </div>
      </div>

      <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Users will be notified when you create a new power thought. Please ensure your content is appropriate and
          inspirational before saving.
        </AlertDescription>
      </Alert>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Power Thought</CardTitle>
            <CardDescription>
              Create a powerful, inspirational thought that will motivate and guide users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter your power thought here..."
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  className="min-h-[200px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {thought.length} characters ({250 - thought.length} remaining)
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-muted-foreground">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || thought.length === 0 || thought.length > 250}>
              {isLoading ? (
                <>
                  <span className="mr-2">Saving...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Save Power Thought
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
