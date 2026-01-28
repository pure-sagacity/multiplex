import { headers } from 'next/headers';
import GetBoard from '@/app/actions/Boards/GetBoard';
import MarkdownEditor from '@/app/components/MarkdownEditor';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  
  const boardData = await GetBoard(boardId);
  
  const initialContent = boardData?.data || `# Welcome to your board\n\nStart editing your markdown here!\n\n## Features\n\n- **Bold** text\n- *Italic* text\n- \`Code\` blocks\n- Lists and numbered items\n- Tables and quotes\n\n| Feature | Status |\n|---------|--------|\n| Markdown Support | ✓ |\n| Live Preview | ✓ |\n| Code Highlighting | ✓ |`;

  return (
    <MarkdownEditor
      boardId={boardId}
      initialContent={initialContent}
    />
  );
}
