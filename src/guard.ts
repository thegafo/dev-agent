// This script checks if the current Node.js version is at least 22.
// If the version is lower than 22, it outputs an error message and terminates the process with a non-zero status code.

// strip the leading “v” and split
const [major] = process.versions.node.replace(/^v/, "").split(".").map(Number);

if (major < 22) {
  console.error(
    `Error: this package requires Node.js >= 22.0.0; you're on ${process.version}`
  );
  process.exit(1);
}
