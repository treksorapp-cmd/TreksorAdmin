"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import DOMPurify from "isomorphic-dompurify"

interface Article {
  _id: string
  title: string
  description: string
  category: string
  image: string
  body: string
  createdAt: string
}

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

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
        setArticle(data.article)
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
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      
      const response = await fetch(`/api/articles/${params._id}`, {
        method: "DELETE",
        headers: {
          
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        router.push("/dashboard/articles")
      } else {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading article...</div>
  }

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Article Details</h2>
            <p className="text-muted-foreground">View and manage article</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => router.push(`/dashboard/articles/${article._id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{article.title}</CardTitle>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{article.category}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg?height=200&width=300"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{article.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.body) }} />
          </div>

          <div className="text-sm text-muted-foreground">
            Created: {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
