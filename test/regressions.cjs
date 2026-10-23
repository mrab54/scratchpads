const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const { test, after } = require('node:test');

// Load the real compiled extension code with a small VS Code API test double.
const settings = {};
const vscode = {
  workspace: { getConfiguration: () => ({ inspect: (key) => ({ defaultValue: settings[key] }) }) },
  window: { tabGroups: { all: [], close: async () => false } },
  TabInputText: class { constructor(uri) { this.uri = uri; } },
  env: { clipboard: { readText: async () => 'clipboard' } },
};
const originalLoad = Module._load;
Module._load = function (name, ...args) {
  return name === 'vscode' ? vscode : originalLoad.call(this, name, ...args);
};
const { Config } = require('../out/config');
const Utils = require('../out/utils').default;
const { InputBox } = require('../out/input-box');
const { ScratchpadsManager } = require('../out/scratchpads.manager');
const { FiletypesManager } = require('../out/filetypes.manager');
const { md5 } = require('../out/md5');
Module._load = originalLoad;
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'scratchpads-tests-'));
Config.projectScratchpadsPath = folder;
after(() => fs.rmSync(folder, { recursive: true, force: true }));

test('directory listing excludes folders', () => {
  fs.writeFileSync(path.join(folder, 'notes.txt'), 'keep');
  fs.mkdirSync(path.join(folder, 'nested'));
  assert.deepEqual(Utils.getScratchpadFiles(), ['notes.txt']);
});

test('filenames cannot escape the scratchpad directory', () => {
  for (const name of ['../outside.txt', '..\\outside.txt', '.', '..', '']) {
    assert.throws(() => Utils.getScratchpadFilePath(name), /Invalid scratchpad filename/);
  }
  assert.equal(Utils.getScratchpadFilePath('my notes.txt'), path.join(folder, 'my notes.txt'));
});

test('canceling the filename prompt does not create a file', async () => {
  settings.promptForFilename = true;
  const originalShow = InputBox.show;
  InputBox.show = async () => undefined;
  try {
    const before = fs.readdirSync(folder);
    await new ScratchpadsManager({}).createScratchpad({ name: 'Text', ext: '.txt' });
    assert.deepEqual(fs.readdirSync(folder), before);
  } finally {
    InputBox.show = originalShow;
    settings.promptForFilename = false;
  }
});

test('canceling a dirty tab close aborts single and bulk deletion', async () => {
  const filePath = path.join(folder, 'notes.txt');
  vscode.window.tabGroups.all = [{ tabs: [{ input: new vscode.TabInputText({ fsPath: filePath }) }] }];
  vscode.window.showQuickPick = async () => 'notes.txt';
  settings.promptForRemoval = false;
  const manager = new ScratchpadsManager({});
  await assert.rejects(manager.removeScratchpad(), /Removal canceled/);
  await assert.rejects(manager.removeAllScratchpads(), /Removal canceled/);
  assert.equal(fs.readFileSync(filePath, 'utf8'), 'keep');
  vscode.window.tabGroups.all = [];
});

test('creation never overwrites a file that already exists', async () => {
  const filePath = path.join(folder, 'notes.txt');
  await assert.rejects(new ScratchpadsManager({}).createAndOpenScratchpadFile(filePath), { code: 'EEXIST' });
  assert.equal(fs.readFileSync(filePath, 'utf8'), 'keep');
});

test('configuration reads see updated settings', () => {
  settings.useGlobalFolder = true;
  assert.equal(Config.getExtensionConfiguration('useGlobalFolder'), true);
  settings.useGlobalFolder = false;
  assert.equal(Config.getExtensionConfiguration('useGlobalFolder'), false);
});

test('input acceptance survives synchronous hide and cleans up the input', async () => {
  let accept, hide, disposed = false;
  vscode.window.createInputBox = () => ({
    value: '',
    onDidChangeValue: () => {},
    onDidAccept: (listener) => { accept = listener; },
    onDidHide: (listener) => { hide = listener; },
    hide: () => hide(),
    dispose: () => { disposed = true; },
    show() { this.value = 'my..notes...txt'; accept(); },
  });
  assert.equal(await InputBox.show({ allowSpaces: true }), 'my.notes.txt');
  assert.equal(disposed, true);
});

test('legacy migration preserves explicit new settings at each scope', async () => {
  const updates = [];
  const originalConfiguration = vscode.workspace.getConfiguration;
  vscode.ConfigurationTarget = { Workspace: 2, Global: 1 };
  vscode.workspace.getConfiguration = () => ({
    inspect: (key) => key === 'scratchpadsFolder' ? {} : { workspaceValue: true, globalValue: true },
    update: async (...args) => updates.push(args),
  });
  try {
    await Config.init({ globalStorageUri: { fsPath: folder } });
    assert.deepEqual(updates, [['useSubfolders', undefined, 2], ['useSubfolders', undefined, 1]]);
  } finally {
    vscode.workspace.getConfiguration = originalConfiguration;
    Config.projectScratchpadsPath = folder;
  }
});

test('failed save aborts rename before the file is moved', async () => {
  const originalShow = InputBox.show;
  const filePath = path.join(folder, 'notes.txt');
  InputBox.show = async () => 'renamed';
  vscode.window.activeTextEditor = { document: { fileName: filePath, save: async () => false } };
  let message;
  vscode.window.showErrorMessage = (value) => { message = value; };
  try {
    await new ScratchpadsManager({}).renameScratchpad();
    assert.match(message, /Could not save/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), 'keep');
    assert.equal(fs.existsSync(path.join(folder, 'renamed.txt')), false);
  } finally {
    InputBox.show = originalShow;
    vscode.window.activeTextEditor = undefined;
  }
});

test('malformed recent filetypes do not prevent built-in type selection', () => {
  Config.recentFiletypesFilePath = path.join(folder, 'filetypes.json');
  fs.writeFileSync(Config.recentFiletypesFilePath, 'null');
  vscode.QuickPickItemKind = { Separator: -1 };
  vscode.window.showWarningMessage = () => {};
  const originalError = console.error;
  console.error = () => {};
  try {
    settings.defaultFiletype = 'js';
    assert.equal(new FiletypesManager().getDefaultFiletype().ext, '.js');
  } finally {
    console.error = originalError;
    fs.unlinkSync(Config.recentFiletypesFilePath);
  }
});

test('project path hashes match Node crypto for Unicode and long paths', () => {
  const { createHash } = require('node:crypto');
  for (const value of ['', 'C:\\Projects\\notes', '/home/user/日本語/😀', 'a'.repeat(1000)]) {
    assert.equal(md5(value), createHash('md5').update(value).digest('hex'));
  }
});
