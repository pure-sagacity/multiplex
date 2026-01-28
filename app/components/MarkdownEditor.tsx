'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Bold,
    Italic,
    Code2,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link2,
    Save,
    Grip,
} from 'lucide-react';
import SaveBoardContent from '@/app/actions/Boards/SaveBoardContent';
import { Toast } from './Toast';
import 'highlight.js/styles/atom-one-light.css';

interface MarkdownEditorProps {
    boardId: string;
    initialContent?: string;
    onSave?: (content: string) => void;
}

export default function MarkdownEditor({
    boardId,
    initialContent = '',
    onSave,
}: MarkdownEditorProps) {
    const [buffer, setBuffer] = useState(initialContent);
    const [savedContent, setSavedContent] = useState(initialContent);
    const [dividerPos, setDividerPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
        'saved' | 'unsaved' | 'saving'
    >('saved');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Initialize CodeMirror editor
    useEffect(() => {
        if (!editorRef.current) return;

        const state = EditorState.create({
            doc: initialContent,
            extensions: [basicSetup, markdown()],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
            dispatch: (tr) => {
                view.update([tr]);
                setBuffer(view.state.doc.toString());
                setSaveStatus('unsaved');

                // Debounced auto-save
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }
                debounceTimerRef.current = setTimeout(() => {
                    handleAutoSave(view.state.doc.toString());
                }, 1500);
            },
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, []);

    const handleAutoSave = useCallback(async (content: string) => {
        setSaveStatus('saving');
        try {
            const result = await SaveBoardContent(boardId, content);
            if (result.success) {
                setSavedContent(content);
                setSaveStatus('saved');
                setToastMessage('Saved successfully');
                setToastType('success');
                onSave?.(content);
            } else {
                setSaveStatus('unsaved');
                setToastMessage(result.error || 'Failed to save');
                setToastType('error');
            }
        } catch (error) {
            setSaveStatus('unsaved');
            setToastMessage('An error occurred while saving. Please try again.');
            setToastType('error');
        }
    }, [boardId, onSave]);

    const handleManualSave = useCallback(() => {
        handleAutoSave(buffer);
    }, [buffer, handleAutoSave]);

    const insertMarkdown = useCallback((before: string, after = '') => {
        if (!viewRef.current) return;

        const view = viewRef.current;
        const { from, to } = view.state.selection.main;
        const selectedText = view.state.sliceDoc(from, to) || 'text';

        const replacement = before + selectedText + after;

        view.dispatch({
            changes: { from, to, insert: replacement },
            selection: { anchor: from + before.length },
        });

        view.focus();
    }, []);

    const insertBlock = useCallback((block: string) => {
        if (!viewRef.current) return;

        const view = viewRef.current;
        const { from, to } = view.state.selection.main;

        // Find the line start
        const lineStart = view.state.doc.lineAt(from).from;
        const isStartOfDoc = lineStart === 0;

        const prefix = isStartOfDoc ? '' : '\n';
        const insertText = prefix + block;

        view.dispatch({
            changes: { from: lineStart, to, insert: insertText },
            selection: { anchor: lineStart + insertText.length },
        });

        view.focus();
    }, []);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const container = editorRef.current?.parentElement;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const newPos = ((e.clientX - rect.left) / rect.width) * 100;

            if (newPos > 20 && newPos < 80) {
                setDividerPos(newPos);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const ToolbarButton = ({
        icon: Icon,
        label,
        onClick,
        tooltip,
    }: {
        icon: React.ComponentType<{ className: string }>;
        label: string;
        onClick: () => void;
        tooltip?: string;
    }) => (
        <div className="tooltip" data-tip={tooltip || label}>
            <button
                onClick={onClick}
                className="btn btn-sm btn-ghost join-item text-neutral hover:bg-neutral/10"
                aria-label={label}
            >
                <Icon className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="border-b border-neutral/20 bg-white p-4">
                <div className="flex items-center justify-between">
                    <span></span>
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-sm font-medium px-2 py-1 rounded ${saveStatus === 'saved'
                                ? 'text-success'
                                : saveStatus === 'saving'
                                    ? 'text-warning'
                                    : 'text-error'
                                }`}
                        >
                            {saveStatus === 'saved'
                                ? '✓ Saved'
                                : saveStatus === 'saving'
                                    ? '◐ Saving...'
                                    : '◯ Unsaved'}
                        </span>
                        <button
                            onClick={handleManualSave}
                            disabled={saveStatus === 'saving'}
                            className="btn btn-sm btn-primary gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-neutral/20 bg-white p-3 overflow-x-auto">
                <div className="join border border-neutral/20 bg-white">
                    <ToolbarButton
                        icon={Heading1}
                        label="Heading 1"
                        onClick={() => insertBlock('# ')}
                        tooltip="# Heading 1"
                    />
                    <ToolbarButton
                        icon={Heading2}
                        label="Heading 2"
                        onClick={() => insertBlock('## ')}
                        tooltip="## Heading 2"
                    />
                    <ToolbarButton
                        icon={Heading3}
                        label="Heading 3"
                        onClick={() => insertBlock('### ')}
                        tooltip="### Heading 3"
                    />

                    <div className="divider divider-horizontal m-0 h-6 before:bg-neutral/20 after:bg-neutral/20" />

                    <ToolbarButton
                        icon={Bold}
                        label="Bold"
                        onClick={() => insertMarkdown('**', '**')}
                        tooltip="**Bold**"
                    />
                    <ToolbarButton
                        icon={Italic}
                        label="Italic"
                        onClick={() => insertMarkdown('*', '*')}
                        tooltip="*Italic*"
                    />
                    <ToolbarButton
                        icon={Code2}
                        label="Code"
                        onClick={() => insertMarkdown('`', '`')}
                        tooltip="`Code`"
                    />

                    <div className="divider divider-horizontal m-0 h-6 before:bg-neutral/20 after:bg-neutral/20" />

                    <ToolbarButton
                        icon={List}
                        label="Bullet List"
                        onClick={() => insertBlock('- ')}
                        tooltip="- Bullet list"
                    />
                    <ToolbarButton
                        icon={ListOrdered}
                        label="Ordered List"
                        onClick={() => insertBlock('1. ')}
                        tooltip="1. Ordered list"
                    />
                    <ToolbarButton
                        icon={Quote}
                        label="Quote"
                        onClick={() => insertBlock('> ')}
                        tooltip="> Blockquote"
                    />
                    <ToolbarButton
                        icon={Link2}
                        label="Link"
                        onClick={() => insertMarkdown('[', '](url)')}
                        tooltip="[Link](url)"
                    />
                </div>
            </div>

            {/* Editor Container with Split View */}
            <div className="flex flex-1 overflow-hidden bg-white">
                {/* Editor Pane */}
                <div
                    className="flex flex-col bg-white overflow-hidden"
                    style={{ width: `${dividerPos}%` }}
                >
                    <div className="px-4 pt-2 text-sm font-medium text-neutral/60">
                        Editor
                    </div>
                    <div
                        ref={editorRef}
                        className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-editor]:bg-white [&_.cm-gutters]:bg-neutral/5 [&_.cm-gutters]:border-r [&_.cm-gutters]:border-neutral/20 [&_.cm-cursor]:bg-neutral"
                    />
                </div>

                {/* Divider */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`w-1 bg-neutral/10 hover:bg-primary/30 cursor-col-resize transition-colors ${isDragging ? 'bg-primary/50' : ''
                        } flex items-center justify-center group`}
                >
                    <Grip className="w-4 h-4 text-neutral/30 group-hover:text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Preview Pane */}
                <div
                    className="flex flex-col bg-white overflow-hidden border-l border-neutral/20"
                    style={{ width: `${100 - dividerPos}%` }}
                >
                    <div className="px-4 pt-2 text-sm font-medium text-neutral/60">
                        Preview
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <div className="prose prose-sm max-w-none text-neutral [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-neutral [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-neutral [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-neutral [&_h3]:mt-4 [&_h3]:mb-2 [&_a]:text-primary [&_code]:bg-neutral/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-neutral/5 [&_pre]:border [&_pre]:border-neutral/20 [&_table]:border-collapse [&_table]:w-full [&_th]:border [&_th]:border-neutral/20 [&_th]:bg-neutral/10 [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-neutral/20 [&_td]:p-2">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code: ({ node, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        if (match) {
                                            return (
                                                <code
                                                    className={`${className} block bg-neutral/5 border border-neutral/20 rounded p-2 overflow-x-auto text-xs`}
                                                    {...props}
                                                >
                                                    {/* Syntax highlighting would be applied here */}
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {buffer}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onDismiss={() => setToastMessage(null)}
                />
            )}
        </div>
    );
}
