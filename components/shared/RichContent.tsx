interface RichContentProps {
  content: string;
}

export function RichContent({ content }: RichContentProps) {
  return (
    <div
      className="rich-content"
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
