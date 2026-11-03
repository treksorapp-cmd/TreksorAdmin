"use client"

import { PublicationFields } from "@/components/publication-fields"
import { publicationDay } from "@/lib/publication"
import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

interface Article {
  _id: string
  title: string
  description: string
  category: string
  image: string
  body: string
}

export default function EditArticlePage() {
  const [date, setDate] = useState(publicationDay())
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticle, setIsLoadingArticle] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const categories = ["Body", "Mind", "Balance", "Purpose"]

  useEffect(() => {
    if (params._id) {
      fetchArticle(params._id as string)
    }
  }, [params._id])

  const fetchArticle = async (_id: string) => {
    try {
      
      const response = await fetch(`/api/articles/${_id}`, {
        headers: {
          
        },
      })

      if (response.ok) {
        const data = await response.json()
        const article = data.article
        setDate(article.date)
        setStatus(article.status)
        setTitle(article.title)
        setDescription(article.description)
        setCategory(article.category)
        setBody(article.body)
        setCurrentImage(article.image)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch article",
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
      setIsLoadingArticle(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("date", date)
      formData.append("status", status)
      formData.append("body", body)
      if (image) {
        formData.append("image", image)
      }

      
      const response = await fetch(`/api/articles/${params._id}`, {
        method: "PATCH",
        headers: {
          
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article updated successfully",
        })
        router.push(`/dashboard/articles/${params._id}`)
      } else {
        toast({
          title: "Error",
          description: "Failed to update article",
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

  if (isLoadingArticle) {
    return <div>Loading article...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Article</h2>
          <p className="text-muted-foreground">Update your article content</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter article description"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              {currentImage && !image && (
                <p className="text-sm text-muted-foreground">Current image will be kept if no new image is selected</p>
              )}
            </div>

            <div className="space-y-2">
              <PublicationFields status={status} date={date} onStatus={setStatus} onDate={setDate} />
              <Label htmlFor="body">Body</Label>
              <RichTextEditor content={body} onChange={setBody} placeholder="Write your article content here..." />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Article"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
