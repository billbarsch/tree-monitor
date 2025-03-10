#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const ignore = require('ignore');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Command line arguments configuration
const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('interval', {
        alias: 't',
        describe: 'Update interval in seconds (se fornecido, monitora continuamente)',
        type: 'number',
        demandOption: false
    })
    .option('directory', {
        alias: 'd',
        describe: 'Directory to monitor',
        type: 'string',
        default: '.',
        demandOption: false
    })
    .option('output-file', {
        alias: 'o',
        describe: 'Output JSON file',
        type: 'string',
        default: 'tree-output.json',
        demandOption: false
    })
    .option('detailed', {
        alias: 'D',
        describe: 'Generate detailed JSON with all file information',
        type: 'boolean',
        default: false
    })
    .argv;

// Resolve absolute paths
const absoluteDirectory = path.resolve(argv.directory);
const absoluteOutputFile = path.resolve(argv['output-file']);

// Function to read .treeignore file
function loadIgnorePatterns(dir) {
    const ignoreFilePath = path.join(dir, '.treeignore');
    try {
        const ignoreContent = fs.readFileSync(ignoreFilePath, 'utf8');
        return ignore().add(ignoreContent);
    } catch (err) {
        // If file doesn't exist, return empty ignore
        return ignore();
    }
}

// Function to create simplified directory tree
function createSimplifiedTree(detailedTree, ig) {
    function processNode(node, currentPath) {
        const result = {};

        if (node.type === 'directory') {
            const relativePath = currentPath === '' ? '.' : currentPath;

            // Processa os arquivos do diretório atual
            const files = node.children
                .filter(child => child.type === 'file')
                .map(child => {
                    const filePath = relativePath === '.' ? child.name : path.join(relativePath, child.name);
                    return { name: child.name, path: filePath };
                })
                .filter(file => !ig.ignores(file.path))
                .map(file => file.name)
                .sort();

            // Adiciona os arquivos ao resultado
            files.forEach(file => {
                result[`"${file}"`] = null;
            });

            // Processa os subdiretórios
            node.children
                .filter(child => child.type === 'directory')
                .forEach(child => {
                    const childPath = relativePath === '.' ? child.name : path.join(relativePath, child.name);
                    if (!ig.ignores(childPath)) {
                        const subTree = processNode(child, childPath);
                        if (Object.keys(subTree).length > 0) {
                            const indentedEntries = Object.entries(subTree)
                                .map(([key, value]) => value === null ?
                                    `    ${key}` :
                                    `    ${key}: ${value.split('\n').join('\n    ')}`)
                                .join(',\n');
                            result[`"${child.name}"`] = `{\n${indentedEntries}\n  }`;
                        }
                    }
                });
        }

        return result;
    }

    return processNode(detailedTree, '');
}

// Function to get relative path safely
function getRelativePath(fullPath) {
    const relativePath = path.relative(absoluteDirectory, fullPath);
    return relativePath === '' ? '.' : relativePath;
}

// Function to create directory tree in JSON format
async function createDirectoryTree(dir, ig) {
    const name = path.basename(dir);
    const stats = await fs.promises.stat(dir);

    if (!stats.isDirectory()) {
        return {
            type: 'file',
            name: name,
            size: stats.size,
            modified: stats.mtime
        };
    }

    const items = await fs.promises.readdir(dir);
    const children = [];

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = getRelativePath(fullPath);

        // Check if file/directory should be ignored
        if (relativePath !== '.' && ig.ignores(relativePath)) {
            continue;
        }

        try {
            const child = await createDirectoryTree(fullPath, ig);
            children.push(child);
        } catch (err) {
            console.error(`Error processing ${fullPath}:`, err);
        }
    }

    // Ordena os filhos alfabeticamente
    children.sort((a, b) => a.name.localeCompare(b.name));

    return {
        type: 'directory',
        name: name,
        children: children,
        modified: stats.mtime
    };
}

// Main function to update JSON file
async function updateTreeFile() {
    try {
        const ig = loadIgnorePatterns(absoluteDirectory);
        const detailedTree = await createDirectoryTree(absoluteDirectory, ig);

        // Choose between detailed or simplified JSON
        const finalTree = argv.detailed ? detailedTree : createSimplifiedTree(detailedTree, ig);

        if (argv.detailed) {
            await fs.promises.writeFile(absoluteOutputFile, JSON.stringify(finalTree, null, 2), 'utf8');
        } else {
            // Formata a saída como uma árvore de arquivos com indentação adequada
            const entries = Object.entries(finalTree)
                .map(([key, value]) => value === null ? `  ${key}` : `  ${key}: ${value}`)
                .join(',\n');

            const output = `{\n${entries}\n}`;
            await fs.promises.writeFile(absoluteOutputFile, output, 'utf8');
        }
    } catch (err) {
        console.error('Error updating directory tree:', err);
    }
}

// Load ignore patterns once
const ig = loadIgnorePatterns(absoluteDirectory);

// Show initial configuration message
console.log(`
Tree Monitor Configuration:
-------------------------
Directory: ${absoluteDirectory}
Output File: ${absoluteOutputFile}
${argv.interval ? `Update Interval: ${argv.interval} seconds` : 'Modo: execução única'}
Format: ${argv.detailed ? 'Detailed JSON' : 'Simplified tree'}
.treeignore: ${fs.existsSync(path.join(absoluteDirectory, '.treeignore')) ? 'Found' : 'Not found'}
-------------------------
${argv.interval ? 'Pressione \'q\' para finalizar o monitoramento' : ''}
-------------------------
${argv.interval ? 'Monitoring started...' : 'Gerando arquivo...'}
`);

// Update file immediately
updateTreeFile().then(() => {
    // Se não tiver intervalo definido, finalizar após a primeira execução
    if (!argv.interval) {
        console.log('Arquivo gerado com sucesso!');
        process.exit(0);
    }
});

// Configura o terminal para modo raw para capturar teclas apenas se estiver no modo contínuo
if (argv.interval) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    // Função para limpar e sair
    function cleanupAndExit() {
        console.log('\nMonitoramento finalizado.');
        process.exit(0);
    }

    // Monitora entrada do teclado
    process.stdin.on('data', function (key) {
        // Ctrl+C ou q para sair
        if (key === '\u0003' || key.toLowerCase() === 'q') {
            cleanupAndExit();
        }
    });

    // Watcher configuration
    const watcher = chokidar.watch(absoluteDirectory, {
        ignored: (filePath) => {
            try {
                if (filePath === absoluteDirectory) return false;
                const relativePath = getRelativePath(filePath);
                return relativePath !== '.' && ig.ignores(relativePath);
            } catch (err) {
                console.error('Error in ignore check:', err);
                return false;
            }
        },
        persistent: true,
        ignoreInitial: false
    });

    // Configurar o intervalo de atualização
    setInterval(updateTreeFile, argv.interval * 1000);

    // Watcher events for real-time updates
    watcher
        .on('add', updateTreeFile)
        .on('unlink', updateTreeFile)
        .on('addDir', updateTreeFile)
        .on('unlinkDir', updateTreeFile)
        .on('change', updateTreeFile)
        .on('error', error => console.error('Watcher error:', error));
} 