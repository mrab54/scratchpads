# Releasing

Releases are built and published automatically by the **Build VSIX** GitHub
Actions workflow (`.github/workflows/build-vsix.yml`). It triggers on any pushed
tag matching `v*`, runs `npm ci`, packages the extension with `@vscode/vsce`,
and creates a GitHub Release with `scratchpads.vsix` attached and auto-generated
release notes.

> There is **no** release unless a `v*` tag is pushed. Pushing to `master` alone
> does nothing.

## Cut a release

Start from a clean `master` (everything committed and in sync with `origin`):

```bash
# 1. Bump the version. Updates BOTH package.json and package-lock.json,
#    which keeps CI's `npm ci` in sync. Use patch / minor / major.
npm version patch --no-git-tag-version

# 2. (Recommended) confirm it packages locally before tagging.
npx @vscode/vsce package --out scratchpads.vsix

# 3. Commit the bump.
git commit -am "Bump version to X.Y.Z"

# 4. Tag and push. The tag push is what publishes the release.
git tag vX.Y.Z
git push origin master
git push origin vX.Y.Z
```

Watch the run under the repo's **Actions** tab. When it finishes, the new
release appears on the **Releases** page.

## Notes

- **Tag must match the version.** `vX.Y.Z` should equal the `version` in
  `package.json` so the published VSIX's internal version matches the release.
- **Keep the lockfile in sync.** `npm version` updates `package-lock.json` for
  you; hand-editing only `package.json` will make CI's `npm ci` fail.
- **Install a built VSIX:** `code --install-extension scratchpads.vsix`.
- **Windows/PowerShell:** if `npm` is blocked by execution policy, run
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or call `npm.cmd` /
  `npx.cmd` directly.
