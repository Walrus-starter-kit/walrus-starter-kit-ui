E2E testing for CLI scaffolders uses Jest with mock-fs for filesystem isolation, inquirer mocking for prompts, and snapshots for generated code diffs. Verify projects by running npm install/build/test/lint in temp dirs. GitHub Actions matrix ensures cross-OS compatibility. [stackoverflow](https://stackoverflow.com/questions/58413428/jest-mocking-and-testing-the-node-js-filesystem)

## Testing Frameworks

- **Jest**: Snapshots compare generated dirs/files; `--updateSnapshot` for regen.
- **Prompt Mocking**: `jest.mock('inquirer')`; mock stdin/stdout.
- **FS Mocking**: mock-fs simulates dir structure; restore post-test. [github](https://github.com/tschaub/mock-fs)

**CLI Test Example**:
```typescript
// cli.test.ts
import { execSync } from 'child_process';
import mock from 'mock-fs';
import path from 'path';
import fs from 'fs';

jest.mock('inquirer', () => ({
  prompt: () => Promise.resolve({ projectName: 'test-app', features: ['walrus'] }),
}));

describe('CLI scaffolding', () => {
  const projectDir = './generated-app';

  beforeEach(() => {
    mock({}); // Clean FS
  });

  afterEach(() => mock.restore());

  it('generates Walrus starter kit', async () => {
    execSync('node bin/cli.js init test-app --features walrus', { cwd: './', stdio: 'pipe' });
    const files = fs.readdirSync(projectDir);
    expect(files).toContain('package.json');
    expect(fs.readFileSync(path.join(projectDir, 'vite.config.ts'), 'utf8')).toMatchSnapshot();
  });
});
```

## Generated Project Verification

Spawn subprocesses in generated dir:

```typescript
// verifyProject.ts
import { execSync } from 'child_process';
import path from 'path';

function verifyProject(dir: string) {
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  expect(pkg.dependencies['@mysten/walrus']).toBeDefined();

  execSync('npm install', { cwd: dir });
  execSync('npm run build', { cwd: dir, timeout: 30000 }); // Build check
  execSync('npm run lint', { cwd: dir }); // ESLint
  execSync('tsc --noEmit', { cwd: dir }); // Type check
  execSync('npm test', { cwd: dir }); // Units
}
```


## CI/CD Configuration

GitHub Actions matrix for OS/Node; test multiple templates.

```yaml
# .github/workflows/e2e.yml
name: E2E CLI Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-14]
        node: [18, 20, 22]
        include:
          - os: ubuntu-latest
            template: walrus-basic
          - os: windows-latest
            template: walrus-nft
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:e2e # jest --runInBand (serial for FS)
        env:
          CI: true
      - name: Performance Benchmark
        run: |
          npm run bench:scaffold # Time init
        if: matrix.os == 'ubuntu-latest'
```
Matrix parallelizes (3 OS x 3 Node x 2 templates); use artifacts for failed dirs. [blacksmith](https://www.blacksmith.sh/blog/matrix-builds-with-github-actions)

## Best Practices

- Run serially (`--runInBand`) for FS conflicts.
- Update snapshots selectively.
- Mock global deps (e.g., npm exec).
- Benchmark scaffold time <5s.
- Separate smoke tests for quick CI feedback. [jestjs](https://jestjs.io/docs/snapshot-testing)