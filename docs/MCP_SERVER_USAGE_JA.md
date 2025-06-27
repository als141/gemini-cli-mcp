# Gemini CLI を MCP サーバーとして使用

このプロジェクトは、Google Gemini CLI を MCP (Model Context Protocol) サーバーとして機能するように拡張し、すべての組み込み Gemini CLI ツールを他の MCP クライアントで使用できるようにします。

## 機能

Gemini CLI MCP サーバーは以下の11個のツールを提供します：

### ファイル操作

- **`gemini.read_file`** - 単一ファイルの内容を読み込み（テキスト、画像、PDF対応）
- **`gemini.read_many_files`** - パスやglobパターンを使用して複数ファイルを読み込み
- **`gemini.write_file`** - ファイルに内容を書き込み
- **`gemini.replace`** - ファイル内のテキストを精密に置換

### ファイルシステム操作

- **`gemini.list_directory`** - ファイルとディレクトリを一覧表示（フィルタリング対応）
- **`gemini.glob`** - globパターンでファイルを検索（例：`src/**/*.ts`）
- **`gemini.search_file_content`** - 正規表現を使用してファイル内容を検索

### シェル操作

- **`gemini.run_shell_command`** - 完全なサブプロセス対応でシェルコマンドを実行

### Web・検索機能

- **`gemini.web_fetch`** - URL（localhost含む）からコンテンツを取得・処理
- **`gemini.google_web_search`** - Gemini API経由でGoogle検索を実行

### メモリ管理

- **`gemini.save_memory`** - 情報を長期記憶に保存

## インストール

```bash
npm install -g gemini-cli-mcp
```

## 使用方法

### MCP サーバーの起動

```bash
# stdio transport を使用して MCP サーバーとして起動
gemini-mcp --serve-mcp
```

サーバーは以下を実行します：

- stdin/stdout で MCP プロトコルメッセージを待機
- 起動情報を stderr にログ出力
- すべての11個の組み込みツールを `gemini.` プレフィックス付きで提供

### 認証設定

#### 方法1: Google アカウント認証（推奨）

事前に Google アカウントで認証を設定：

```bash
# Google アカウントで認証（初回のみ）
gemini-mcp --prompt "test" --yolo

# 認証後、MCPサーバーとして起動
gemini-mcp --serve-mcp
```

認証情報は `~/.gemini/` に保存され、MCPサーバー起動時に自動的に使用されます。

#### 方法2: API キー使用

環境変数で Gemini API キーを設定：

```bash
export GEMINI_API_KEY="your-api-key-here"
gemini-mcp --serve-mcp
```

### MCP クライアントでの設定

#### Claude Desktop 設定

`claude_desktop_config.json` に追加：

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": [
        "--serve-mcp"
      ],
      "cwd": "/path/to/your/workspace"
    }
  }
}
```

**Google アカウント認証使用時の注意：**

- `env` での `GEMINI_API_KEY` 設定は不要
- 事前認証が必要（上記「認証設定」参照）

#### その他の MCP クライアント

stdio transport をサポートするクライアント用：

```bash
# サーバー起動コマンド
gemini-mcp --serve-mcp
```

### ツール呼び出し例

#### ディレクトリ内容の一覧表示

```json
{
  "name": "gemini.list_directory",
  "arguments": {
    "path": "/path/to/directory"
  }
}
```

#### ファイル内容の検索

```json
{
  "name": "gemini.search_file_content",
  "arguments": {
    "pattern": "function\\s+\\w+",
    "path": "/path/to/search",
    "include": "*.ts"
  }
}
```

#### シェルコマンドの実行

```json
{
  "name": "gemini.run_shell_command",
  "arguments": {
    "command": "npm test",
    "description": "テストスイートの実行"
  }
}
```

#### 複数ファイルの読み込み

```json
{
  "name": "gemini.read_many_files",
  "arguments": {
    "paths": ["src/**/*.ts", "docs/*.md"],
    "exclude": ["**/node_modules/**"]
  }
}
```

#### Web検索

```json
{
  "name": "gemini.google_web_search",
  "arguments": {
    "query": "TypeScript ベストプラクティス 2024"
  }
}
```

## 開発

### プロジェクトのビルド

```bash
npm install
npm run build
```

### MCP 機能のテスト

MCP 機能を検証するためのテストクライアントが提供されています：

```bash
node test-mcp-client.js
```

これにより以下が実行されます：

1. MCP サーバーの起動
2. クライアントとしての接続
3. 利用可能ツールの一覧表示
4. サンプルツール呼び出しのテスト
5. クリーンアップと終了

### プロジェクト構造

```
packages/
├── cli/
│   ├── src/
│   │   ├── commands/
│   │   │   └── serve-mcp.ts     # MCP サーバー実装
│   │   ├── config/
│   │   │   └── config.ts        # --serve-mcp フラグ付き CLI 設定
│   │   └── gemini.tsx           # メイン CLI エントリーポイント
│   └── dist/                    # ビルド済み JavaScript ファイル
└── core/
    └── src/
        └── tools/               # すべてのツール実装
```

## 実装の詳細

### アーキテクチャ

- **`GeminiCliMcpServer`**: Gemini CLI ツールをラップするメイン MCP サーバークラス
- **ツールレジストリ**: すべての利用可能ツールを管理・提供
- **トランスポート**: MCP 通信に stdio を使用
- **設定**: すべての Gemini CLI 設定機能を継承

### ツールラッピング

各 Gemini CLI ツールは以下のようにラップされます：

- ツール名に `gemini.` プレフィックスを追加
- ツールパラメータを MCP スキーマ形式に変換
- ツール実行とレスポンス形式の処理
- 適切なエラーハンドリングを提供

### セキュリティと安全性

- すべてのツールは Gemini CLI の組み込み安全機能を継承
- ファイル操作は作業ディレクトリに制限
- シェルコマンドは承認モードで設定可能
- Web アクセスは Gemini CLI のネットワークポリシーに従う

## 環境変数

MCP サーバーはすべての標準 Gemini CLI 環境変数を尊重します：

- `GEMINI_API_KEY` - Web検索機能に必要（Google アカウント認証使用時は不要）
- `GEMINI_MODEL` - AI機能に使用するモデル
- `GEMINI_CLI_NO_RELAUNCH` - メモリ再起動動作を防止

## 認証の詳細

### Google アカウント認証の設定手順

1. **初回認証**：
   ```bash
   gemini-mcp --prompt "test" --yolo
   ```
2. **認証の確認**：

   ```bash
   ls ~/.gemini/
   ```

   認証ファイルが作成されていることを確認

3. **MCP サーバー起動**：
   ```bash
   gemini-mcp --serve-mcp
   ```

### 認証ファイルの場所

- **Linux/macOS**: `~/.gemini/`
- **Windows**: `%USERPROFILE%\.gemini\`

認証情報は暗号化されて保存され、MCPサーバー起動時に自動的に読み込まれます。

## トラブルシューティング

### サーバーが起動しない

1. プロジェクトがビルドされていることを確認: `npm run build`
2. Node.js バージョンを確認: Node.js 18+ が必要
3. MCP SDK 依存関係がインストールされていることを確認

### ツールが動作しない

1. Web/検索ツール用に認証が設定されていることを確認
2. ファイルシステムツール用にファイル権限を確認
3. パス基準操作用に作業ディレクトリを確認

### クライアント接続の問題

1. stdio transport が正しく設定されていることを確認
2. サーバープロセスがエラーなしで起動することを確認
3. クライアントとサーバーの MCP SDK バージョンが互換性があることを確認

### 認証関連の問題

1. **Google アカウント認証が失敗する場合**：

   ```bash
   # 認証をリセット
   rm -rf ~/.gemini/
   # 再認証
   gemini-mcp --prompt "test" --yolo
   ```

2. **API キーが認識されない場合**：
   ```bash
   echo $GEMINI_API_KEY  # 環境変数が設定されていることを確認
   ```

## 貢献

このプロジェクトは Google Gemini CLI を拡張しています。貢献するには：

1. リポジトリをフォーク
2. MCP サーバー実装に変更を加える
3. 提供されたテストクライアントでテスト
4. プルリクエストを送信

## ライセンス

このプロジェクトは元の Google Gemini CLI プロジェクトと同じライセンスを維持しています。
