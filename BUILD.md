# MarkView 构建指南

本文档介绍如何在不同平台上编译和打包 MarkView 应用程序。

## 📋 前置要求

### 基础依赖
- **Node.js** (推荐 v18+)
- **pnpm** 包管理器
- **Rust** 工具链 (通过 rustup 安装)
- **Tauri CLI** (`cargo install tauri-cli`)

### 平台特定依赖

#### macOS
- Xcode Command Line Tools
- 无需额外配置

#### Windows (在 macOS 上交叉编译)
- NSIS: `brew install nsis`
- LLVM: `brew install llvm`
- LLD: `brew install lld`
- cargo-xwin: `cargo install --locked cargo-xwin`
- 配置环境变量: `export PATH="/opt/homebrew/opt/llvm/bin:$PATH"`

#### Linux (在 macOS 上交叉编译)
- 需要完整的交叉编译环境（复杂，建议使用 CI/CD）

## 🛠️ 构建命令

### 开发模式
```bash
# 启动开发服务器
pnpm tauri dev
```

### 生产构建

#### macOS 平台
```bash
# ARM64 版本 (Apple Silicon)
pnpm tauri build

# 通用版本 (Intel + Apple Silicon)
pnpm tauri build --target universal-apple-darwin
```

#### Windows 平台 (在 macOS 上交叉编译)
```bash
# 64位 Windows 版本
pnpm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc

# 32位 Windows 版本 (不推荐，可能失败)
pnpm tauri build --runner cargo-xwin --target i686-pc-windows-msvc
```

#### Linux 平台 (实验性)
```bash
# 64位 Linux 版本 (可能需要额外配置)
pnpm tauri build --target x86_64-unknown-linux-gnu
```

## 📦 输出位置

所有构建产物位于 `src-tauri/target/` 目录下，按目标平台分类：

### macOS 安装包

#### ARM64 版本 (Apple Silicon)
- **DMG 安装包**: `src-tauri/target/release/bundle/dmg/MarkView_1.0.0_aarch64.dmg`
- **应用程序包**: `src-tauri/target/release/bundle/macos/MarkView.app`
- **可执行文件**: `src-tauri/target/release/markview`

#### 通用版本 (Intel + Apple Silicon)
- **DMG 安装包**: `src-tauri/target/universal-apple-darwin/release/bundle/dmg/MarkView_1.0.0_universal.dmg`
- **应用程序包**: `src-tauri/target/universal-apple-darwin/release/bundle/macos/MarkView.app`
- **可执行文件**: `src-tauri/target/universal-apple-darwin/release/markview`

### Windows 安装包

#### 64位版本
- **NSIS 安装程序**: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/MarkView_1.0.0_x64-setup.exe`
- **可执行文件**: `src-tauri/target/x86_64-pc-windows-msvc/release/markview.exe`

### Linux 安装包 (如果构建成功)
- **AppImage**: `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/`
- **DEB 包**: `src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/`
- **可执行文件**: `src-tauri/target/x86_64-unknown-linux-gnu/release/markview`

## 🎯 推荐的分发包

### 用户推荐
- **macOS 用户**: `MarkView_1.0.0_universal.dmg` (兼容 Intel 和 Apple Silicon)
- **Windows 用户**: `MarkView_1.0.0_x64-setup.exe` (支持现代 64 位系统)

### 文件大小参考
- macOS Universal DMG: ~6.5MB
- macOS ARM64 DMG: ~3.3MB
- Windows 64位安装程序: ~2.2MB
- Windows 64位可执行文件: ~8.8MB

## ⚠️ 注意事项

### 交叉编译限制
1. **Windows 交叉编译**:
   - 仅支持 64 位版本
   - 无法进行代码签名（需要在 Windows 上完成）
   - MSI 安装包不支持交叉编译

2. **Linux 交叉编译**:
   - 需要复杂的环境配置
   - 建议使用 GitHub Actions 或 Docker

3. **代码签名**:
   - macOS: 需要 Apple Developer 证书
   - Windows: 需要代码签名证书

### 故障排除

#### 常见错误
1. **缺少 WebView2**: Windows 用户需要安装 WebView2 Runtime
2. **权限问题**: macOS 可能需要在系统偏好设置中允许应用运行
3. **依赖缺失**: 确保所有前置依赖已正确安装

#### 清理构建缓存
```bash
# 清理 Rust 构建缓存
cargo clean

# 清理 Node.js 依赖
rm -rf node_modules
pnpm install
```

## 🚀 CI/CD 构建

项目包含 GitHub Actions 工作流，可以自动构建多平台安装包：
- `.github/workflows/` 目录包含自动化构建配置
- 推送到主分支时自动触发构建
- 支持自动发布到 GitHub Releases

## 📚 相关资源

- [Tauri 官方文档](https://tauri.app/)
- [Tauri 构建指南](https://tauri.app/v1/guides/building/)
- [交叉编译文档](https://tauri.app/v1/guides/building/cross-platform/)