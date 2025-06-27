# Gemini CLI MCP Server - Quick Start Guide

## セットアップと起動

### 1. インストール
```bash
npm install -g gemini-cli-mcp
```

### 2. MCPサーバーの起動
```bash
# MCPサーバーとして起動
gemini-mcp --serve-mcp
```

### 3. 動作確認
```bash
# 基本的な動作確認
gemini-mcp --prompt "Hello" --yolo
```

## Claude Code での設定

```bash
# Claude Codeに追加（推奨）
claude mcp add gemini-cli -s user gemini-mcp --serve-mcp

# API キーを使用する場合
claude mcp add gemini-cli -e GEMINI_API_KEY=your-key gemini-mcp --serve-mcp
```

## Claude Desktop での設定（参考）

`claude_desktop_config.json` に以下を追加：

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": [
        "--serve-mcp"
      ]
    }
  }
}
```

## 認証設定（初回のみ）

Google アカウントで認証する場合：

```bash
# 初回認証
gemini-mcp --prompt "test" --yolo

# 認証確認
ls ~/.gemini/

# MCPサーバー起動
gemini-mcp --serve-mcp
```

## 利用可能なツール

- `gemini.read_file` - ファイル読み込み
- `gemini.write_file` - ファイル書き込み
- `gemini.list_directory` - ディレクトリ一覧
- `gemini.search_file_content` - ファイル内容検索
- `gemini.run_shell_command` - シェルコマンド実行
- `gemini.google_web_search` - Google検索
- その他6つのツール

## トラブルシューティング

### インストールエラー
```bash
# パッケージを再インストール
npm uninstall -g gemini-cli-mcp
npm install -g gemini-cli-mcp
```

### 認証エラー
```bash
# 認証をリセット
rm -rf ~/.gemini/
# 再認証
gemini-mcp --prompt "test" --yolo
```

詳細は `MCP_SERVER_USAGE.md` および `MCP_SERVER_USAGE_JA.md` を参照してください。