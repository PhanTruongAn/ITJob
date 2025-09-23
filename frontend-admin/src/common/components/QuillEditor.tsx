import Quill from "quill"
import "quill/dist/quill.snow.css"
import React, { useEffect, useRef } from "react"

const QuillEditor: React.FC<{
  value?: string
  onChange?: (v: string) => void
}> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill>()

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      })

      quillRef.current.on("text-change", () => {
        if (onChange) {
          onChange(quillRef.current!.root.innerHTML)
        }
      })
    }
  }, [])

  // Cập nhật value từ ngoài vào editor
  useEffect(() => {
    if (
      quillRef.current &&
      value !== undefined &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return <div ref={editorRef} style={{ minHeight: 400 }} />
}

export default QuillEditor
