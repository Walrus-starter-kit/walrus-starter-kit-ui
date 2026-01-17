Node.js `path` module handles cross-platform paths automatically, using `/` on Unix/macOS and `\` on Windows. Always prefer `path.join()` and `path.resolve()` over string concatenation to avoid separator issues and traversal vulnerabilities. Validation prevents security risks like path traversal via `../` or Windows device names (e.g., CON). [stackoverflow](https://stackoverflow.com/questions/66042298/how-to-correctly-create-cross-platform-paths-with-nodejs)

## Windows-Specific Handling

Windows paths start with drive letters (C:\), use `\` separators, and hit 260-char MAX_PATH limit (use `\\?\` prefix or enable LongPathsEnabled registry). PowerShell/CMD handle native formats; WSL uses Unix-style but maps Windows drives (/mnt/c/). CLI tools must resolve relative paths with `path.resolve()` to get absolute, normalized forms. [github](https://github.com/ehmicky/cross-platform-node-guide/blob/main/docs/3_filesystem/file_paths.md)

## Node.js Path API Usage

- **path.join(...parts)**: Joins with platform separator, ignores non-strings (e.g., `path.join('foo', 'bar')` → 'foo/bar' Unix, 'foo\\bar' Windows). [nodejs](https://nodejs.org/api/path.html)
- **path.resolve([from...], to)**: Makes absolute from cwd/from dirs (e.g., `path.resolve('..', 'file.txt')` resolves like `cd ..; cd file.txt; pwd`). [shapeshed](https://shapeshed.com/writing-cross-platform-node/)
- **path.normalize(p)**: Collapses `..`/`./` but doesn't resolve to absolute (use after join for cleaning). [millermedeiros.github](https://millermedeiros.github.io/mdoc/examples/node_api/doc/path.html)
- **Validation**: Check `path.isAbsolute()`; regex for safe paths: `^(?!.*[<>:"/\\|?*]|(?:^|[/\\])(\.\.|CON|PRN|AUX|NUL|COM\d+|LPT\d+)[/\\]?)[a-zA-Z0-9_./\\\-]+$` (blocks traversal, devices, invalid chars). [zeropath](https://zeropath.com/blog/cve-2025-27210-nodejs-path-traversal-windows)

## Testing Strategies

Test via CI matrix (GitHub Actions: ubuntu-latest/windows-latest/macos-latest) with vitest/jest spawning processes. Mock `process.platform` or use `path.win32`/`path.posix` for portable tests; verify with `fs.existsSync(resolvedPath)`. Pitfalls: unnormalized inputs, device name bypasses, long paths (>260 chars without prefix). [github](https://github.com/ehmicky/cross-platform-node-guide/blob/main/docs/3_filesystem/file_paths.md)

## Code Examples

```javascript
const path = require('node:path');
const fs = require('node:fs');

// Safe join/resolve
const safePath = path.resolve(path.join(baseDir, userInput));

// Validate before use
function validatePath(input) {
  const normalized = path.normalize(input);
  if (!path.isAbsolute(normalized) || /[<>"|?*\x00-\x1f]/.test(normalized) ||
      /^(?:CON|PRN|AUX|NUL|COM\d+|LPT\d+)/i.test(normalized.replace(/\\/g, '/'))) {
    throw new Error('Invalid path');
  }
  return normalized;
}
```

**Test Cases** (use in CI):

| Input                  | Platform | Expected Output (resolve from /home/test) | Valid? |
|------------------------|----------|-------------------------------------------|--------|
| '../foo/bar.txt'      | Unix    | /home/foo/bar.txt                        | Yes   |
| '..\\foo\\bar.txt'    | Windows | C:\foo\bar.txt (from C:\home\test)       | Yes   |
| 'CON\\..\\etc\\passwd'| Windows | Invalid (blocked)                        | No    |
| '/very/long/path...'  | Windows | \\?\C:\very\long... (260+ chars)         | Check len |
| './../..'             | All     | / (root)                                 | Yes   |  [stackoverflow](https://stackoverflow.com/questions/66042298/how-to-correctly-create-cross-platform-paths-with-nodejs)