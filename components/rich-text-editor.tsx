"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  FileText,
} from "lucide-react"
import { useCallback, useState } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
        bulletList: {
          HTMLAttributes: {
            class: "tiptap-bullet-list",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "tiptap-ordered-list",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      // Clean up the HTML output
      let html = editor.getHTML()

      // Remove empty paragraphs
      html = html.replace(/<p><\/p>/g, "")
      html = html.replace(/<p>\s*<\/p>/g, "")

      // Remove paragraphs that only contain whitespace or line breaks
      html = html.replace(/<p>[\s\r\n]*<\/p>/g, "")

      // Clean up whitespace characters
      html = html.replace(/\\r\\n/g, " ")
      html = html.replace(/\r\n/g, " ")
      html = html.replace(/\s+/g, " ")

      // Remove leading/trailing spaces in tags
      html = html.replace(/>\s+</g, "><")

      onChange(html)
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[200px] p-4 max-w-none tiptap-editor",
      },
      transformPastedHTML(html) {
        // Clean the HTML before it's inserted
        let cleanHtml = html

        // Remove extra whitespace and line breaks
        cleanHtml = cleanHtml.replace(/\r\n/g, " ")
        cleanHtml = cleanHtml.replace(/\n/g, " ")
        cleanHtml = cleanHtml.replace(/\s+/g, " ")

        // Remove empty paragraphs
        cleanHtml = cleanHtml.replace(/<p>\s*<\/p>/g, "")

        return cleanHtml
      },
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const handleHtmlPaste = useCallback(() => {
    if (htmlContent && editor) {
      // Clean the HTML before inserting
      let cleanHtml = htmlContent

      // Remove extra whitespace and line breaks
      cleanHtml = cleanHtml.replace(/\r\n/g, " ")
      cleanHtml = cleanHtml.replace(/\n/g, " ")
      cleanHtml = cleanHtml.replace(/\s+/g, " ")

      // Remove empty paragraphs
      cleanHtml = cleanHtml.replace(/<p>\s*<\/p>/g, "")

      // Clean up spacing around tags
      cleanHtml = cleanHtml.replace(/>\s+</g, "><")
      cleanHtml = cleanHtml.trim()

      editor.commands.insertContent(cleanHtml)
      setHtmlContent("")
      setHtmlDialogOpen(false)
    }
  }, [htmlContent, editor])

  const cleanContent = useCallback(() => {
    if (editor) {
      let html = editor.getHTML()

      // Remove empty paragraphs
      html = html.replace(/<p><\/p>/g, "")
      html = html.replace(/<p>\s*<\/p>/g, "")
      html = html.replace(/<p>[\s\r\n]*<\/p>/g, "")

      // Clean up whitespace
      html = html.replace(/\\r\\n/g, " ")
      html = html.replace(/\r\n/g, " ")
      html = html.replace(/\s+/g, " ")
      html = html.replace(/>\s+</g, "><")

      editor.commands.setContent(html)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="border border-input rounded-md">
        <div className="border-b border-input p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-accent" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-accent" : ""}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-accent" : ""}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline (Ctrl+U)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-accent" : ""}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Strikethrough</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "bg-accent" : ""}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inline Code</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 1</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 2</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Heading 3</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-accent" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-accent" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Numbered List</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-accent" : ""}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quote</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Links and Images */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setLink}
                className={editor.isActive("link") ? "bg-accent" : ""}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add/Edit Link</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" onClick={addImage}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insert Image</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* HTML Paste */}
          <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" onClick={()=>setHtmlDialogOpen(true)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste HTML Content</p>
                </TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[100vh]">
              <DialogHeader>
                <DialogTitle>Paste HTML Content</DialogTitle>
                <DialogDescription>
                  Paste your HTML content from ChatGPT or other sources. The content will be automatically cleaned and
                  formatted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="html-content">HTML Content</Label>
                  <Textarea
                    id="html-content"
                    placeholder="Paste your HTML content here..."
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setHtmlContent("")
                      setHtmlDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleHtmlPaste} disabled={!htmlContent.trim()}>
                    Insert Content
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" onClick={cleanContent}>
                <span className="text-xs font-bold">Clean</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clean HTML Formatting</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <EditorContent editor={editor} className="min-h-[300px] max-h-[500px] overflow-y-auto" />

        <div className="border-t border-input p-2 text-xs text-muted-foreground">
          <p>💡 Tip: Use "Paste HTML" for ChatGPT content, then click "Clean" to remove extra formatting</p>
        </div>
      </div>
    </TooltipProvider>
  )
}
