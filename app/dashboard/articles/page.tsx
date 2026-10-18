"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Article {
  _id: string
  title: string
  description: string
  category: string
  image: string
  createdAt: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const categories = ["All", "Body", "Mind", "Balance", "Purpose"]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((article) => article.category === selectedCategory))
    }
  }, [articles, selectedCategory])

  const fetchArticles = async () => {
    try {
      
      const response = await fetch("/api/articles", {
        headers: {
          
        },
      })

      if (response.ok) {
        const data = await response.json()
        setArticles(data.data || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch articles",
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

  const handleDeleteArticle = async (_id: any) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      
      const response = await fetch(`/api/articles/${_id}`, {
        method: "DELETE",
        headers: {
          
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        fetchArticles()
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
    return <div>Loading articles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
          <p className="text-muted-foreground">Manage your articles and content</p>
        </div>
        <Button onClick={() => router.push("/dashboard/articles/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Article
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article._id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={article.image || "/placeholder.svg?height=200&width=300"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{article.category}</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/articles/${article._id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteArticle(article._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              <CardDescription className="line-clamp-3">{article.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/dashboard/articles/${article._id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found</p>
        </div>
      )}
    </div>
  )
}
