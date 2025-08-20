#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all MDX files
function findMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to extract TODO comments from MDX content
function extractTodos(content, filePath) {
  const todos = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Simple approach: check if line contains TODO and JSX comment structure
    if (line.includes('TODO') && line.includes('{/*') && line.includes('*/}')) {
      // Extract the TODO text between {/* and */}
      const start = line.indexOf('{/*') + 3;
      const end = line.indexOf('*/}');
      if (start > 2 && end > start) {
        const todoText = line.substring(start, end).trim();
        todos.push({
          line: index + 1,
          text: todoText,
          type: 'jsx'
        });
      }
    }
    
    // Match regular comments with TODO (fallback)
    const regularTodoMatch = line.match(/\/\/\s*(TODO[^]*)/);
    if (regularTodoMatch) {
      todos.push({
        line: index + 1,
        text: regularTodoMatch[1].trim(),
        type: 'regular'
      });
    }
  });
  
  return todos;
}

// Function to generate the TODO page content
function generateTodoPage(todoData) {
  const now = new Date().toISOString().split('T')[0];
  
  let content = `---
title: 'Internal TODO List'
description: 'Comprehensive list of all TODO items across the documentation'
hidden: true
---

# Internal TODO List

> **Generated on:** ${now}  
> **Total files with TODOs:** ${todoData.length}  
> **Total TODO items:** ${todoData.reduce((sum, file) => sum + file.todos.length, 0)}

This page is automatically generated and contains all TODO comments from across the documentation. It's hidden from the main navigation and intended for internal use only.

`;

  // Group by directory for better organization
  const groupedByDir = {};
  todoData.forEach(file => {
    const dir = path.dirname(file.relativePath);
    if (!groupedByDir[dir]) {
      groupedByDir[dir] = [];
    }
    groupedByDir[dir].push(file);
  });

  // Generate content for each directory
  Object.keys(groupedByDir).sort().forEach(dir => {
    const files = groupedByDir[dir];
    content += `\n## ${dir}\n\n`;
    
    files.forEach(file => {
      content += `### [${path.basename(file.relativePath)}](${file.relativePath.replace(/\.mdx$/, '')})\n\n`;
      
      if (file.todos.length === 0) {
        content += `*No TODOs found*\n\n`;
      } else {
        file.todos.forEach(todo => {
          content += `- **Line ${todo.line}:** ${todo.text}\n`;
        });
        content += `\n`;
      }
    });
  });

  content += `
---

> **Note:** This page is automatically generated. To add a TODO, use the format: \`{/* TODO: Your todo text */}\` in any MDX file.
`;

  return content;
}

// Main execution
function main() {
  try {
    const rootDir = path.join(__dirname, '..');
    const mdxFiles = findMdxFiles(rootDir);
    
    console.log(`Found ${mdxFiles.length} MDX files`);
    
    const todoData = [];
    
    mdxFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf8');
      const todos = extractTodos(content, filePath);
      
      // Debug: log files with content that might contain TODOs
      if (content.includes('TODO')) {
        console.log(`Found TODO in content: ${filePath}`);
        console.log(`Extracted todos:`, todos);
      }
      
      if (todos.length > 0) {
        const relativePath = path.relative(rootDir, filePath);
        todoData.push({
          filePath,
          relativePath,
          todos
        });
      }
    });
    
    // Sort by relative path for consistent ordering
    todoData.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    
    // Generate the TODO page
    const todoPageContent = generateTodoPage(todoData);
    const outputPath = path.join(rootDir, 'internal', 'todos.mdx');
    
    // Ensure the internal directory exists
    const internalDir = path.dirname(outputPath);
    if (!fs.existsSync(internalDir)) {
      fs.mkdirSync(internalDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, todoPageContent);
    
    console.log(`Generated TODO page at: ${outputPath}`);
    console.log(`Found ${todoData.length} files with TODOs`);
    console.log(`Total TODO items: ${todoData.reduce((sum, file) => sum + file.todos.length, 0)}`);
    
  } catch (error) {
    console.error('Error generating TODO page:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
