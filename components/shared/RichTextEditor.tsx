"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold as BoldIcon,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Plus,
  Minus,
} from "lucide-react";
import { FontSize, FONT_SIZES, DEFAULT_FONT_SIZE } from "@/lib/tiptapFontSize";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rich-content min-h-[300px] max-h-[500px] overflow-y-auto bg-black border border-gold/20 rounded-b-xl py-3 px-4 text-cream focus:outline-none",
        dir: "rtl",
      },
    },
  });

  if (!editor) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || DEFAULT_FONT_SIZE;

  const stepFontSize = (direction: 1 | -1) => {
    const index = FONT_SIZES.indexOf(currentSize);
    const currentIndex = index === -1 ? FONT_SIZES.indexOf(DEFAULT_FONT_SIZE) : index;
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      FONT_SIZES.length - 1
    );
    editor.chain().focus().setFontSize(FONT_SIZES[nextIndex]).run();
  };

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-all ${
      active ? "bg-gold text-black" : "bg-gold/10 text-gold hover:bg-gold/20"
    }`;

  return (
    <div className="rounded-xl overflow-hidden border border-gold/20">
      <div className="flex items-center gap-2 flex-wrap p-2 bg-black-light border-b border-gold/20">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="عريض"
          aria-label="عريض"
        >
          <BoldIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gold/20" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={btnClass(editor.isActive({ textAlign: "right" }))}
          title="محاذاة يمين"
          aria-label="محاذاة يمين"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={btnClass(editor.isActive({ textAlign: "center" }))}
          title="توسيط"
          aria-label="توسيط"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={btnClass(editor.isActive({ textAlign: "left" }))}
          title="محاذاة يسار"
          aria-label="محاذاة يسار"
        >
          <AlignLeft size={16} />
        </button>

        <div className="w-px h-6 bg-gold/20" />

        <button
          type="button"
          onClick={() => stepFontSize(-1)}
          className={btnClass(false)}
          title="تصغير الخط"
          aria-label="تصغير الخط"
        >
          <Minus size={16} />
        </button>
        <span className="text-xs text-gold-muted min-w-[32px] text-center">
          {parseInt(currentSize)}
        </span>
        <button
          type="button"
          onClick={() => stepFontSize(1)}
          className={btnClass(false)}
          title="تكبير الخط"
          aria-label="تكبير الخط"
        >
          <Plus size={16} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
