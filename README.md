# Tree Monitor

Um monitor de diretórios que gera uma representação em formato de árvore da estrutura de arquivos.

## Características

- Monitoramento em tempo real de diretórios
- Suporte a arquivos `.treeignore` para excluir arquivos/diretórios
- Atualização automática em intervalos configuráveis
- Dois formatos de saída: detalhado (JSON) e simplificado (árvore)
- Saída fácil com a tecla 'q'
- Valores padrão para facilitar o uso

## Download

Baixe a versão mais recente para seu sistema operacional:

- [Windows (64-bit)](https://github.com/billbarsch/tree-monitor/releases/latest/download/tree-monitor-win.exe)
- [Linux](https://github.com/billbarsch/tree-monitor/releases/latest/download/tree-monitor-linux)
- [macOS](https://github.com/billbarsch/tree-monitor/releases/latest/download/tree-monitor-macos)

## Instalação

### Usando o Executável (Recomendado)

1. Baixe o executável para seu sistema operacional usando os links acima
2. (Opcional) Adicione o diretório do executável ao PATH do sistema
3. Execute o programa via linha de comando

### Instalação Manual (Para Desenvolvedores)

1. Clone o repositório:
```bash
git clone https://github.com/billbarsch/tree-monitor.git
cd tree-monitor
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o executável:
```bash
npm run build
```

## Uso

```bash
# Uso completo com todos os parâmetros
tree-monitor --interval <segundos> --directory <diretório> --output-file <arquivo-saída> [--detailed]

# Uso mais simples com valores padrão
tree-monitor [--interval <segundos>] [--detailed]
```

### Parâmetros

- `--interval, -t`: Intervalo de atualização em segundos (opcional - se fornecido, ativa o modo de monitoramento contínuo)
- `--directory, -d`: Diretório a ser monitorado (opcional - padrão: diretório atual)
- `--output-file, -o`: Arquivo de saída (opcional - padrão: "tree-output.json")
- `--detailed, -D`: Gera saída detalhada em formato JSON (opcional)

### Modos de Operação

O Tree Monitor possui dois modos de operação:

1. **Modo de Execução Única**: Quando o parâmetro `--interval` não é fornecido, o programa executa uma única vez, gera o arquivo de saída e finaliza automaticamente.

2. **Modo de Monitoramento Contínuo**: Quando o parâmetro `--interval` é fornecido, o programa monitora continuamente o diretório e atualiza o arquivo de saída no intervalo especificado. Neste modo, você pode pressionar a tecla 'q' para sair.

### Exemplos

1. Uso mínimo (execução única no diretório atual com saída em "tree-output.json"):
```bash
tree-monitor
```

2. Monitoramento contínuo no diretório atual com valores padrão:
```bash
tree-monitor --interval 30
```

3. Monitoramento contínuo básico:
```bash
tree-monitor --interval 30 --directory "." --output-file "tree-output.json"
```

4. Execução única em um diretório específico:
```bash
tree-monitor --directory "./meu-projeto"
```

5. Execução única com nome de arquivo personalizado:
```bash
tree-monitor --output-file "estrutura-projeto.json"
```

6. Execução única com saída detalhada:
```bash
tree-monitor --detailed
```

7. Monitoramento contínuo com saída detalhada:
```bash
tree-monitor --interval 30 --detailed
```

## Formatos de Saída

### Formato Simplificado (padrão)
```json
{
  ".gitignore",
  "LICENSE",
  "README.md",
  "package.json",
  "src": { "index.js" }
}
```

### Formato Detalhado (com --detailed)
```json
{
  "type": "directory",
  "name": "project",
  "children": [
    {
      "type": "file",
      "name": "README.md",
      "size": 2974,
      "modified": "2024-02-27T09:05:00.000Z"
    },
    {
      "type": "directory",
      "name": "src",
      "children": [
        {
          "type": "file",
          "name": "index.js",
          "size": 1234,
          "modified": "2024-02-27T09:00:00.000Z"
        }
      ],
      "modified": "2024-02-27T09:00:00.000Z"
    }
  ],
  "modified": "2024-02-27T09:05:00.000Z"
}
```

## Arquivo .treeignore

O arquivo `.treeignore` usa a mesma sintaxe do `.gitignore` para especificar quais arquivos e diretórios devem ser ignorados. Exemplo:

```
# Arquivos e pastas do Node.js
node_modules/

# Arquivos de build
dist/

# Arquivos do Git
.git/

# O próprio arquivo de saída
tree-output.json
```

## Saindo do Programa

No modo de monitoramento contínuo, para finalizar o monitoramento, pressione a tecla 'q' ou use Ctrl+C.
No modo de execução única, o programa finaliza automaticamente após gerar o arquivo de saída.

## Desenvolvimento

### Compilando o Projeto

Para compilar o projeto para diferentes plataformas:

```bash
# Compilar para todas as plataformas
npm run build

# Ou compilar individualmente
npm run build-win
npm run build-linux
npm run build-macos
```

### Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

MIT 