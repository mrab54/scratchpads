# Scratchpads

> **Create multiple scratchpad files for doodling while you're coding**

A VSCode extension that lets you create temporary files for quick notes, code snippets, and experimentation without cluttering your project workspace.

This is a personal fork of [buenon/scratchpads](https://github.com/buenon/scratchpads) with all third-party runtime dependencies removed and self-hosted distribution via GitHub Releases.

![Create new Scratchpad](https://raw.githubusercontent.com/mrab54/scratchpads/master/images/scratchpad_new.gif)

## 🚨 **Breaking Changes in v2.0.0**

**⚠️ Important**: If you're upgrading from v1.x, your existing scratchpads may not appear in the UI. Your files are safe on disk!

### **What Changed?**

**Bug fix**: v1.x incorrectly used the VS Code installation path (same for all projects) instead of the workspace path to generate project folder hashes. This caused all projects to share the same folder hash.

**v2.0.0 fixes**: Project hash now uses the actual workspace folder path. Default changed from project-specific to global folder.

### **Recovery Steps**

1. Run `Scratchpads: Open scratchpads folder` (opens `<storage>/scratchpads/` root)
2. Find your files in hash-named folders (32-char MD5 strings)
3. Move files to:
   - **Global mode** (default): `<storage>/scratchpads/__globalScratchpads__/`
   - **Project-specific mode**: `<storage>/scratchpads/<new-project-hash>/` (create a test scratchpad to see the new hash)

## ✨ Features

### 🚀 **Quick Creation**

- Create scratchpads instantly with any file extension
- Support for 100+ programming languages and file types
- Full VSCode IntelliSense and syntax highlighting
- Never interfere with your project's source control

### 📁 **Smart Organization**

- **Global scratchpads** (default): Share scratchpads across all projects
- **Project-specific folders**: Each project gets its own scratchpad folder
- Custom storage location support
- Automatic folder management

### 🎯 **Explorer Integration**

- View all scratchpads directly in VSCode's Explorer panel
- Rename and delete files with inline buttons
- Quick actions toolbar for instant creation
- Auto-refresh when files change
- Welcome view with helpful guidance

### ⚡ **Smart Automation**

- **Auto Paste**: Automatically paste clipboard content into new scratchpads
- **Auto Format**: Format document content automatically (when auto paste is enabled)
- **Quick Access**: Open your most recent scratchpad instantly
- **Bulk Operations**: Remove all scratchpads with one command

## 🎯 Perfect For

- **Quick Prototyping**: Test ideas without creating permanent files
- **Code Snippets**: Save useful code fragments for later reference
- **Learning**: Practice new languages and frameworks
- **Documentation**: Write notes and documentation drafts
- **Debugging**: Isolate and test specific code sections
- **Experimentation**: Try different approaches without cluttering your project

## Installation

Download the latest `.vsix` from [GitHub Releases](https://github.com/mrab54/scratchpads/releases) and install:

```bash
code --install-extension scratchpads-x.x.x.vsix
```

Or in VSCode: **Extensions** sidebar > **...** menu > **Install from VSIX...**

## Getting Started

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Type** `Scratchpads: New scratchpad` and press Enter
3. **Choose** your file type and start coding!

## 🎮 How to Use

### Creating Scratchpads

| Command                                 | Description                                   | Use Case                                       |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `Scratchpads: New scratchpad`           | Create a new scratchpad with custom file type | When you need a specific file extension        |
| `Scratchpads: New scratchpad (default)` | Create using your default file type           | Quick creation with your preferred language    |
| `Scratchpads: Open scratchpad`          | Browse and open existing scratchpads          | When you want to continue working on something |
| `Scratchpads: Open latest scratchpad`   | Open your most recent scratchpad              | Quick access to your last work                 |

### Managing Scratchpads

| Command                                | Description                    | Use Case                               |
| -------------------------------------- | ------------------------------ | -------------------------------------- |
| `Scratchpads: Rename scratchpad`       | Rename any scratchpad file     | Better organization and identification |
| `Scratchpads: Remove scratchpad`       | Delete a specific scratchpad   | Clean up individual files              |
| `Scratchpads: Remove all scratchpads`  | Delete all scratchpads at once | Complete cleanup                       |
| `Scratchpads: New filetype`            | Add custom file extensions     | Support for new languages or formats   |
| `Scratchpads: Remove custom filetype`  | Remove custom file extensions  | Clean up your filetype list            |
| `Scratchpads: Open scratchpads folder` | Open scratchpads folder        | Access your files directly             |

### Explorer Panel (Optional)

Enable `Scratchpads: Show In Explorer` in settings to:

- See all scratchpads in a dedicated tree view
- Use inline rename/delete buttons
- Access quick action toolbar
- Get visual guidance when no scratchpads exist

## ⚙️ Configuration

| Setting                   | Description                           | Default     | Use When                     |
| ------------------------- | ------------------------------------- | ----------- | ---------------------------- |
| **Show In Explorer**      | Display scratchpads in Explorer panel | `false`     | Visual file management       |
| **Use Global Folder**     | Share scratchpads across all projects | `true`      | Working on multiple projects |
| **Auto Paste**            | Paste clipboard content automatically | `true`      | Faster workflow              |
| **Auto Format**           | Format document content automatically | `true`      | Clean, readable code         |
| **Default Filetype**      | Default extension for quick creation  | `""`        | You prefer one language      |
| **File Prefix**           | Prefix for new files                  | `"scratch"` | Custom naming convention     |
| **Prompt For Filename**   | Ask for custom names                  | `false`     | You want control over naming |
| **Prompt For Removal**    | Confirm before deleting all           | `true`      | Safety against accidents     |
| **Scratchpads Folder**    | Custom storage location               | Auto        | You want specific location   |
| **Rename With Extension** | Include extension in rename           | `false`     | You want full control        |

## 📝 **Filename Guidelines**

To ensure your scratchpads work correctly across all systems, filenames are automatically filtered to include only safe characters:

### ✅ **Allowed Characters**

- **Letters**: `A-Z`, `a-z`
- **Numbers**: `0-9`
- **Symbols**: `_` (underscore), `-` (hyphen), `.` (dot)
- **Spaces**: Spaces are now supported within filenames (v2.1.0+)
- Leading or trailing dots and spaces are automatically removed
- 2 or more consecutive dots are replaced with a single dot

### 💡 **Examples**

- `my scratch notes.js`
- `API endpoints v2.json`
- `quick-test.py`
- `notes 2024.md`

## 📂 **Folder Organization Explained**

The extension supports two organization modes:

### 🌐 **Global Folder Mode** (Default: `useGlobalFolder: true`)

- **All scratchpads** are stored in a single shared folder
- **Perfect for**: Working across multiple projects, sharing snippets, quick notes
- **Location**: `<storage>/scratchpads/__globalScratchpads__/`

### 📁 **Project-Specific Mode** (`useGlobalFolder: false`)

- **Each workspace** gets its own dedicated scratchpad folder
- **Perfect for**: Project-specific notes, keeping work separated
- **Location**: `<storage>/scratchpads/<project-hash>/`

### 🚫 **No Workspace Open**

When VS Code has no workspace or folder open:

- **Always uses global folder** regardless of configuration
- Ensures scratchpads are always accessible
- Perfect for quick notes before opening a project

> **⚠️ Important**: Settings related to folder location (`Use Global Folder` and `Scratchpads Folder`) do not automatically migrate existing files. When changing these settings, your existing scratchpads will remain in their current location.

## Pro Tips 💡

- **Enable Explorer Integration** for visual file management
- **Set a default filetype** for faster creation
- **Use Auto Paste** to quickly capture clipboard content
- **Use Auto Format** along with **Auto Paste** to automatically format the clipboard content
- **Organize by project** to keep scratchpads separate
- **Add keyboard shortcuts** for your most-used commands

## Building from Source

```bash
npm ci
npm run package
npx vsce package
```

This produces a `scratchpads-3.0.0.vsix` file you can install with:

```bash
code --install-extension scratchpads-3.0.0.vsix
```

## Fork Changes

- Removed all third-party runtime dependencies (`ts-md5`, `language-map`)
- Pure TypeScript MD5 implementation (`src/md5.ts`)
- Inlined language-to-extension mappings (`src/languages.json`)
- Zero supply chain risk - no npm packages bundled at runtime
- Self-hosted distribution via GitHub Releases

## Source

- Fork: [GitHub](https://github.com/mrab54/scratchpads)
- Original: [GitHub](https://github.com/buenon/scratchpads)

## License

[MIT](https://raw.githubusercontent.com/mrab54/scratchpads/master/LICENSE)

See [THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES) for attribution of derived code.
