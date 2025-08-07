"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  leftPanelWidth: number;
  onResetLayout: () => void;
}

export function SettingsDialog({ leftPanelWidth, onResetLayout }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="设置">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>应用设置</DialogTitle>
          <DialogDescription>
            管理 MarkView 的显示和行为设置
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 窗口设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">窗口设置</CardTitle>
              <CardDescription>
                窗口大小和位置会自动保存，下次启动时恢复
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">当前分隔线位置</p>
                  <p className="text-xs text-muted-foreground">
                    左侧面板宽度: {leftPanelWidth.toFixed(1)}%
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onResetLayout();
                    setOpen(false);
                  }}
                >
                  重置布局
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 应用信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">应用信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">应用名称:</span>
                <span>MarkView</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">版本:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">初始窗口大小:</span>
                <span>1200 × 800</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">最小窗口大小:</span>
                <span>800 × 600</span>
              </div>
            </CardContent>
          </Card>

          {/* 快捷键说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">快捷键</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">切换阅读模式:</span>
                  <span><kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">F11</kbd> 或 <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+R</kbd></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">打开文件:</span>
                  <span><kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+O</kbd></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">导出PDF:</span>
                  <span><kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+S</kbd></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}