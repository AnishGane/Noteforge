"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { updateNote } from "@/server/note";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
  Superscript,
  Subscript,
} from "lucide-react";

interface RichTextEditorProps {
  content?: JSONContent;
  noteId?: string;
}

const SAVE_DELAY = 500;

const isEqualJSON = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  const lastSavedRef = useRef<JSONContent | null>(content ?? null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasMounted = useRef(false);
  


  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: true,
    editable: true,
    injectCSS: false,
    immediatelyRender: false,

    content: content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Start writing..." }],
        },
      ],
    },

    onUpdate: ({ editor }) => {
      if (!noteId || !hasMounted.current) return;

      const newContent = editor.getJSON();

      // ❌ Prevent unnecessary updates
      if (isEqualJSON(newContent, lastSavedRef.current)) return;

      setSaved(false);
      setIsSaving(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          await updateNote(noteId, { content: newContent });
          lastSavedRef.current = newContent;
          setSaved(true);
        } finally {
          setIsSaving(false);
        }
      }, SAVE_DELAY);
    },
  });

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasLoadedContent = useRef(false);

  useEffect(() => {
    if (!editor) return;
    if (!content) return;
    if (hasLoadedContent.current) return;
  
    editor.commands.setContent(content);
    lastSavedRef.current = content;
    setSaved(true);
  
    hasLoadedContent.current = true;
  }, [editor, content]);
  

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor.isActive("bold"),
        canBold: ctx.editor.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor.isActive("italic"),
        canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor.isActive("strike"),
        canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor.isActive("code"),
        canCode: ctx.editor.can().chain().focus().toggleCode().run(),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
      };
    },
  });

  const getActiveHeading = () => {
    if (editorState?.isHeading1) return "H1";
    if (editorState?.isHeading2) return "H2";
    if (editorState?.isHeading3) return "H3";
    return "H1";
  };

  return (
    <div className="relative w-full max-w-full bg-card rounded-lg border overflow-hidden">
      {/* Saving Indicator */}
      <div className="absolute top-4 right-3 text-xs text-muted-foreground">
        {isSaving && "Saving…"}
        {!isSaving && !saved && "Unsaved changes"}
        {!isSaving && saved && "Saved"}
      </div>

      {/* Toolbar (unchanged) */}
      {/* ... YOUR TOOLBAR CODE STAYS EXACTLY THE SAME ... */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
            >
              {getActiveHeading()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border">
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Paragraph
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isBulletList
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isOrderedList
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isBold
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isItalic
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isStrike
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editorState?.canCode}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isCode
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Additional Tools */}
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Superscript className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Subscript className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add Button */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button> */}
      </div>

      {/* Editor */}
      <div className="min-h-96 p-6 bg-card">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-96"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
