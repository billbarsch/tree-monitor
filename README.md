# Tree Monitor

Um monitor de diretórios que gera uma representação em formato de árvore da estrutura de arquivos.

## Características

- Monitoramento em tempo real de diretórios
- Suporte a arquivos `.treeignore` para excluir arquivos/diretórios
- Atualização automática em intervalos configuráveis
- Dois formatos de saída: detalhado (JSON) e simplificado (árvore)
- Saída fácil com a tecla 'q'

## Instalação

### Usando o Instalador (Recomendado para Windows)

1. Baixe o arquivo `tree-monitor-setup.exe` da seção de releases
2. Execute o instalador e siga as instruções na tela
3. O programa será instalado e adicionado ao PATH do sistema automaticamente

### Instalação Manual

1. Clone o repositório:
```bash
git clone https://seu-repositorio/tree-monitor.git
cd tree-monitor
```

2. Instale as dependências:
```bash
npm install
```

## Uso

### Como comando global (recomendado)

1. Instale globalmente:
```bash
npm install -g .
```

2. Execute o comando:
```bash
tree-monitor --interval 5 --directory "/path/to/directory" --output-file "tree.json"
```

### Como executável

1. Compile o executável:
```bash
npm run build
```

2. O executável será gerado na pasta `dist`. Execute-o:
```bash
./dist/tree-monitor.exe --interval 5 --directory "/path/to/directory" --output-file "tree.json"
```

### Argumentos

- `--interval, -t`: Intervalo de atualização em segundos
- `--directory, -d`: Diretório a ser monitorado
- `--output-file, -o`: Arquivo JSON onde será salva a estrutura

## Arquivo .treeignore

Você pode criar um arquivo `.treeignore` no diretório monitorado para ignorar arquivos e pastas específicos. A sintaxe é similar ao `.gitignore`:

```
node_modules/
*.log
.git/
temp/
```

## Formato do JSON

O arquivo JSON gerado terá a seguinte estrutura:

```json
{
  "type": "directory",
  "name": "directory-name",
  "children": [
    {
      "type": "file",
      "name": "file.txt",
      "size": 1234,
      "modified": "2024-01-01T00:00:00.000Z"
    },
    {
      "type": "directory",
      "name": "subdirectory",
      "children": [],
      "modified": "2024-01-01T00:00:00.000Z"
    }
  ],
  "modified": "2024-01-01T00:00:00.000Z"
}
```

## Criando o Instalador

Para criar o instalador do programa, siga estes passos:

1. Instale o Inno Setup em seu sistema:
   - Baixe do site oficial: https://jrsoftware.org/isdl.php
   - Execute o instalador do Inno Setup
   - **Importante**: Certifique-se de que o diretório de instalação do Inno Setup está no PATH do sistema

2. Gere o executável e o instalador com um único comando:
```bash
npm run dist
```

Ou, se preferir fazer separadamente:
```bash
# Apenas compilar o executável
npm run build

# Apenas gerar o instalador
npm run make-installer
```

O instalador será gerado na pasta `dist` como `tree-monitor-setup.exe`

## Licença

MIT 