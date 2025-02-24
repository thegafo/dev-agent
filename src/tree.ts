import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

interface GenerateDirectoryTreeOptions {
  /**
   * Additional ignore patterns (relative to the directory root) that you want to exclude.
   * For example: ['dist', '*.log', 'node_modules']
   */
  extraIgnores?: string[];
}

/**
 * Recursively generates a visual "tree" string of a given directory and its contents,
 * ignoring files/folders based on:
 *  1. Patterns in a .gitignore file at the directory's root
 *  2. Additional patterns passed via `extraIgnores`.
 *
 * @param dirPath - The path to the directory to traverse.
 * @param options - Optional configuration (e.g., custom ignore patterns).
 * @returns A string representing the directory structure in a tree-like format.
 */
export function generateDirectoryTree(
  dirPath: string,
  options: GenerateDirectoryTreeOptions = {},
): string {
  const { extraIgnores = [] } = options;

  // Normalize the directory path (handles edge cases like trailing slash).
  const rootDir = path.resolve(dirPath);

  // Get the name of the root directory (will be the top line in the tree output).
  const rootName = '.'; // path.basename(rootDir);

  // Create an ignore instance to filter files/folders
  const ig = ignore();

  // 1. Load .gitignore rules if present
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const ignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    ig.add(ignoreContent);
  }

  // 2. Add any custom ignore patterns passed in
  if (extraIgnores.length > 0) {
    ig.add(extraIgnores);
  }

  /**
   * Recursive function to build the tree string
   * @param currentPath - The absolute path of the current directory we're traversing
   * @param indent - The string used for indentation (├──, └──, etc.)
   * @param relativeToRoot - A relative path from the `rootDir` to `currentPath`
   */
  function buildTree(
    currentPath: string,
    indent: string,
    relativeToRoot: string,
  ): string {
    let result = '';

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch (err) {
      // If we fail to read (permission issues, for example), skip
      return result;
    }

    // Sort in alphabetical order to have consistent output
    entries.sort((a, b) => a.name.localeCompare(b.name));

    entries.forEach((entry, index) => {
      const entryName = entry.name;
      const entryPath = path.join(currentPath, entryName);
      // Build the path relative to rootDir (used for ignore checks)
      const entryRelativePath = path.join(relativeToRoot, entryName);

      // Check if this entry is ignored by .gitignore or extra patterns
      if (ig.ignores(entryRelativePath)) {
        return; // skip
      }

      // Determine whether this is the last item in the current directory
      const isLast = index === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';

      // Add the entry to the tree
      result += `${indent}${connector}${entryName}\n`;

      // If directory, recurse
      if (entry.isDirectory()) {
        // Update indentation for sub-level
        const newIndent = indent + (isLast ? '    ' : '│   ');
        result += buildTree(entryPath, newIndent, entryRelativePath);
      }
    });

    return result;
  }

  // Build our tree output starting from the top directory
  let treeOutput = `${rootName}\n`;
  treeOutput += buildTree(rootDir, '', '');

  return treeOutput;
}

if (require.main === module) {
  const tree = generateDirectoryTree('.', {
    extraIgnores: ['dist', '*.log', 'node_modules', '.git'],
  });

  console.log(tree);
}
