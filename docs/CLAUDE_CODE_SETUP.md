# Claude CodeでGemini CLI MCPサーバーを設定

Claude CodeでGemini CLI MCPサーバーを設定する方法を説明します。

## 前提条件

1. Claude Codeがインストールされていること
2. Gemini API キーまたはGoogle アカウント認証が設定済み

## インストール

### 1. パッケージのインストール
```bash
npm install -g gemini-cli-mcp
```

### 2. MCPサーバーの追加

#### 基本コマンド（現在のプロジェクトのみ）
```bash
claude mcp add gemini-cli gemini-mcp --serve-mcp
```

#### プロジェクト全体で共有する場合
```bash
claude mcp add gemini-cli -s project gemini-mcp --serve-mcp
```

#### すべてのプロジェクトで使用する場合
```bash
claude mcp add gemini-cli -s user gemini-mcp --serve-mcp
```

### 3. API キーを使用する場合
```bash
claude mcp add gemini-cli -e GEMINI_API_KEY=your-api-key-here gemini-mcp --serve-mcp
```

### 4. 設定の確認
```bash
# 追加されたサーバーの確認
claude mcp list

# 特定のサーバーの詳細確認
claude mcp get gemini-cli
```

### 5. Claude Code内での確認
Claude Codeを起動し、以下のコマンドで動作確認：
```
/mcp
```

## 利用可能なツール

MCPサーバーが正常に追加されると、以下のツールが利用可能になります：

### ファイル操作
- `gemini_read_file` - ファイル読み込み（テキスト、画像、PDF対応）
- `gemini_read_many_files` - 複数ファイルの一括読み込み
- `gemini_write_file` - ファイル書き込み
- `gemini_replace` - ファイル内テキストの精密置換

### ファイルシステム操作
- `gemini_list_directory` - ディレクトリ一覧表示
- `gemini_glob` - Globパターンファイル検索
- `gemini_search_file_content` - ファイル内容の正規表現検索

### システム操作
- `gemini_run_shell_command` - シェルコマンド実行

### Web・検索機能
- `gemini_web_fetch` - URL内容取得
- `gemini_google_web_search` - Google検索

### メモリ管理
- `gemini_save_memory` - 長期記憶への情報保存

## 使用例

### ファイル操作の例
```
> gemini_read_fileを使ってpackage.jsonの内容を確認してください

> src/ディレクトリ内のTypeScriptファイルをすべて読み込んでください

> 新しいコンポーネントファイルを作成してください
```

### 検索・分析の例
```
> プロジェクト内で"useState"を使用している箇所を検索してください

> このプロジェクトの構造を分析してください

> 最新のReactベストプラクティスについて調べてください
```

### システム操作の例
```
> npmのテストを実行してください

> プロジェクトをビルドしてください

> gitの状態を確認してください
```

## トラブルシューティング

### サーバーが起動しない場合
```bash
# Gemini CLI MCPサーバーの動作確認
gemini-mcp --serve-mcp

# パッケージの再インストール
npm uninstall -g gemini-cli-mcp
npm install -g gemini-cli-mcp
```

### 認証エラーの場合
```bash
# Google アカウント認証の設定
gemini-mcp --prompt "test" --yolo

# 認証状態の確認
ls ~/.gemini/
```

### サーバーの削除
```bash
claude mcp remove gemini-cli
```

## 高度な設定

### 環境変数の設定
```bash
# 複数の環境変数を設定
claude mcp add gemini-cli \
  -e GEMINI_API_KEY=your-api-key \
  -e GEMINI_MODEL=gemini-2.0-flash-exp \
  gemini-mcp --serve-mcp
```

### プロジェクト固有の設定
```bash
# プロジェクトスコープで追加（.mcp.jsonに保存）
claude mcp add gemini-cli -s project gemini-mcp --serve-mcp
```

生成される`.mcp.json`ファイル：
```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": [
        "--serve-mcp"
      ],
      "env": {}
    }
  }
}
```

## 注意事項

1. **セキュリティ**: Gemini CLI MCPサーバーはシステムコマンドを実行できるため、信頼できる環境でのみ使用してください
2. **認証**: Google アカウント認証を使用する場合、事前認証が必要です
3. **パフォーマンス**: 大量のファイル操作や長時間のコマンド実行では応答時間が長くなる場合があります
4. **リソース**: MCPサーバーは別プロセスとして動作するため、システムリソースを消費します
5. **Google検索**: Google検索機能は正常に動作し、Gemini APIのGrounding機能を使用します

## トラブルシューティング更新

### Google検索エラーが発生する場合

Google検索は正常に実装されており、以下の手順で動作を確認できます：

1. **認証確認**:
   ```bash
   ls ~/.gemini/  # oauth_creds.json が存在することを確認
   ```

2. **直接テスト**:
   ```bash
   gemini-mcp --prompt "latest AI news" --yolo
   ```

3. **Claude Codeでの再試行**: 
   一時的なネットワークエラーの可能性があるため、数秒待ってから再試行してください。

詳細な使用方法については、`MCP_SERVER_USAGE.md`および`MCP_SERVER_USAGE_JA.md`を参照してください。