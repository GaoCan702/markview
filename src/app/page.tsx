"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SettingsDialog } from "@/components/SettingsDialog";

export default function Home() {
  const [markdownText, setMarkdownText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentFileName, setCurrentFileName] = useState("");
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // 左侧面板宽度百分比
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 实时渲染 Markdown
  useEffect(() => {
    const renderMarkdown = async () => {
      if (markdownText.trim()) {
        const rendered = await marked(markdownText);
        setHtmlContent(rendered);
      } else {
        setHtmlContent("");
      }
    };
    void renderMarkdown();
  }, [markdownText]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 或 Ctrl+R 切换阅读模式
      if (event.key === 'F11' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        setIsReadingMode(prev => !prev);
      }
      // Ctrl+O 打开文件
      if (event.ctrlKey && event.key === 'o') {
        event.preventDefault();
        fileInputRef.current?.click();
      }
      // Ctrl+S 导出PDF
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (markdownText.trim()) {
          window.print();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdownText]);

  // 清空内容
  const clearContent = useCallback(() => {
    setMarkdownText("");
    setHtmlContent("");
    setCurrentFileName("");
  }, []);

  // 处理分隔线拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // 限制拖拽范围在 20% 到 80% 之间
    const clampedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftPanelWidth(clampedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 重置分隔线位置
  const resetPanelWidth = useCallback(() => {
    setLeftPanelWidth(50);
  }, []);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 导出为 PDF
  const exportToPDF = useCallback(() => {
    window.print();
  }, []);

  // 切换阅读模式
  const toggleReadingMode = useCallback(() => {
    setIsReadingMode(!isReadingMode);
  }, [isReadingMode]);

  // 打开文件
  const openFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdownText(content);
        setCurrentFileName(file.name);
      };
      reader.readAsText(file);
    }
    // 清空 input 值，允许重复选择同一文件
    event.target.value = '';
  }, []);

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => f.name.endsWith('.md') || f.name.endsWith('.txt'));
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdownText(content);
        setCurrentFileName(file.name);
      };
      reader.readAsText(file);
    }
  }, []);

  const welcomeText = `# 欢迎使用 MarkView

这是一个简单易用的 Markdown 预览工具。

## 使用方法

1. **输入文本**: 在左侧输入或粘贴 Markdown 文本
2. **打开文件**: 点击"打开文件"按钮选择 .md 或 .txt 文件
3. **拖拽文件**: 直接将文件拖拽到应用窗口中
4. **实时预览**: 右侧会实时显示渲染效果
5. **导出文档**: 点击"导出为 PDF"保存文档

## 快捷键

- **F11** 或 **Ctrl+R** - 切换阅读模式
- **Ctrl+O** - 打开文件
- **Ctrl+S** - 导出PDF

## 示例内容

### 标题

支持 **粗体**、*斜体* 和 ~~删除线~~ 文本。

### 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

1. 有序列表项 1
2. 有序列表项 2

### 代码

行内代码：\`console.log('Hello World')\`

代码块：
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### 引用

> 这是一个引用块
> 可以包含多行内容

### 链接

[访问 GitHub](https://github.com)

---

开始编辑左侧内容，体验实时预览功能！`;

  return (
    <div className="h-screen flex flex-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">MarkView</h1>
          <span className="text-sm text-muted-foreground">
            {currentFileName ? `当前文件: ${currentFileName}` : "Markdown 预览工具"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openFile}
          >
            打开文件
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleReadingMode}
          >
            {isReadingMode ? "退出阅读模式" : "阅读模式"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearContent}
            disabled={!markdownText.trim()}
          >
            清空内容
          </Button>
          <Button
            size="sm"
            onClick={exportToPDF}
            disabled={!markdownText.trim()}
          >
            导出为 PDF
          </Button>
          {!isReadingMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetPanelWidth}
              title="重置分隔线位置"
            >
              重置布局
            </Button>
          )}
          <SettingsDialog
            leftPanelWidth={leftPanelWidth}
            onResetLayout={resetPanelWidth}
          />
        </div>
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* 左侧输入区 */}
        {!isReadingMode && (
          <>
            <div className="flex flex-col" style={{ width: `${leftPanelWidth}%` }}>
              <div className="p-4 border-b bg-muted/30">
                <h2 className="text-sm font-medium text-muted-foreground">Markdown 输入</h2>
              </div>
              <div className="flex-1 p-4">
                <Textarea
                  placeholder={markdownText ? "" : "请在此输入或粘贴 Markdown 文本..."}
                  value={markdownText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setMarkdownText(e.target.value);
                  }}
                  className="w-full h-full resize-none border-0 focus-visible:ring-0 text-sm font-mono"
                />
              </div>
            </div>
            {/* 可拖拽的分隔线 */}
            <div
              className={`w-1 bg-border hover:bg-primary/20 cursor-col-resize transition-colors relative group ${
                isDragging ? 'bg-primary/30' : ''
              }`}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-8 bg-primary/40 rounded-full" />
              </div>
            </div>
          </>
        )}

        {/* 右侧预览区 */}
        <div className={`${isReadingMode ? 'w-full' : ''} flex flex-col`} style={!isReadingMode ? { width: `${100 - leftPanelWidth}%` } : {}}>
          <div className="p-4 border-b bg-muted/30">
            <h2 className="text-sm font-medium text-muted-foreground">预览效果</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {htmlContent ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div
                   className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground"
                   dangerouslySetInnerHTML={{ __html: marked(welcomeText) as string }}
                 />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
