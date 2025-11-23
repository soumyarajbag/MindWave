# Prettier Setup Guide

Prettier has been integrated into the MindWave project for consistent code formatting.

## Installation

Install the required dependencies:

```bash
npm install
```

This will install:

- `prettier` - Code formatter
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier

## Usage

### Format All Files

Format all files in the project:

```bash
npm run format
```

### Check Formatting

Check if files are formatted correctly (useful for CI/CD):

```bash
npm run format:check
```

### Format Specific Files

Format specific files or directories:

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

## Configuration

Prettier is configured via `.prettierrc`:

- **Semicolons**: Enabled
- **Single Quotes**: Enabled for JS/TS
- **Double Quotes**: Used for JSX
- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Trailing Commas**: ES5 compatible
- **Arrow Parens**: Always include parentheses

## Editor Integration

### VS Code

The project includes `.vscode/settings.json` for automatic formatting:

- **Format on Save**: Enabled
- **Format on Paste**: Enabled
- **Default Formatter**: Prettier

**Required Extension:**

- Install [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Other Editors

1. Install Prettier extension/plugin for your editor
2. Configure to use project settings
3. Enable format on save

## Git Integration

### Pre-commit Hook (Optional)

To format files before committing, you can use `husky` and `lint-staged`:

```bash
npm install --save-dev husky lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,css,md}": ["prettier --write"]
  }
}
```

## Ignored Files

Files ignored by Prettier are listed in `.prettierignore`:

- `node_modules`
- Build outputs (`.next`, `out`, `build`)
- Environment files (`.env*`)
- Logs and OS files
- Public assets

## ESLint Integration

ESLint and Prettier are configured to work together:

- `eslint-config-prettier` disables conflicting ESLint rules
- Both tools can be used without conflicts

## Formatting Rules

### JavaScript/TypeScript

- Single quotes for strings
- Semicolons required
- 2-space indentation
- 100 character line width

### JSX/TSX

- Double quotes for JSX attributes
- Self-closing tags when possible
- Props on new lines if needed

### JSON

- 2-space indentation
- Trailing commas where valid

## Troubleshooting

### Prettier Not Formatting

1. Check that Prettier extension is installed
2. Verify `.prettierrc` exists
3. Check VS Code settings (if using VS Code)
4. Run `npm run format` manually

### Conflicts with ESLint

If you see formatting conflicts:

1. Ensure `eslint-config-prettier` is installed
2. Check `.eslintrc.json` includes `"prettier"` in extends
3. Restart your editor

### Different Formatting

If files format differently:

1. Check `.prettierrc` configuration
2. Ensure no local Prettier config overrides
3. Run `npm run format` to apply project settings

## CI/CD Integration

Add format checking to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Check formatting
  run: npm run format:check
```

## Best Practices

1. **Format before committing**: Run `npm run format` before committing
2. **Use format on save**: Enable in your editor
3. **Check in CI**: Add format check to your CI pipeline
4. **Consistent style**: Let Prettier handle all formatting decisions

## Commands Reference

```bash
# Format all files
npm run format

# Check formatting (no changes)
npm run format:check

# Format specific file
npx prettier --write path/to/file.ts

# Format specific directory
npx prettier --write "src/**/*.{ts,tsx}"
```
