const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

// 設定
const SOURCE_DIR = path.join(__dirname, '../src');
const TARGET_DIR = path.join(__dirname, '../dist');
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    // 必要に応じてシンタックスハイライトを追加する場合
    // highlight: function (str, lang) { /* ... */ } 
});

// distディレクトリを作成（存在しない場合）
if (fs.existsSync(TARGET_DIR)) {
    // 既存のファイルをクリーンアップしたい場合はここに追加
} else {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// srcディレクトリ内のファイルを取得
fs.readdir(SOURCE_DIR, (err, files) => {
    if (err) {
        console.error('Error reading source directory:', err);
        return;
    }

    files.filter(file => path.extname(file) === '.md').forEach(mdFileName => {
        const mdFilePath = path.join(SOURCE_DIR, mdFileName);
        const baseName = path.basename(mdFileName, '.md');
        const htmlFileName = `${baseName}.html`;
        const htmlFilePath = path.join(TARGET_DIR, htmlFileName);

        try {
            // 1. Markdownファイルを読み込む
            const markdownContent = fs.readFileSync(mdFilePath, 'utf8');

            // 2. HTMLに変換する
            const htmlContent = md.render(markdownContent);

            // 3. 完全なHTMLドキュメントを作成
            const finalHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseName}</title>
    <link rel="stylesheet" href="https://unpkg.com/mvp.css">
    <style>
      header {
        background-color: #cceeee;
        padding: 0 10px;
        text-align: left;
        font-size: 27px;
        display: flex;
        justify-content: space-between;
        box-shadow: 0px 0px 10px -5px #777777;
      }
      header nav {
        margin: 0;
        padding: 0;
      }
      header nav ul li {
        font-weight: normal;
        font-size: 20px;
        margin: 0 10px;
        padding: 0;
      }
      header nav ul li a:hover {
        text-decoration: underline;
      }
      header nav ul li a {
        color: #111;
        font-weight: normal;
        text-decoration: none;
      }
      header nav ul {
        display: flex;
        justify-content: space-around;
        margin: 0 10px;
      }
    </style>
</head>
<body>
    <header>
      Ninastan
      <nav>
        <ul>
          <li><a href="/">TOP</a></li>
        </ul>
      </nav>
    </header>
    <main>
      ${htmlContent}
    </main>
    <footer>
      <span>&copy; Ninastan All rights reserved.</span>
    </footer>
</body>
</html>`;

            // 4. distディレクトリに出力
            fs.writeFileSync(htmlFilePath, finalHtml);
            console.log(`Successfully converted ${mdFileName} to ${htmlFileName}`);

        } catch (error) {
            console.error(`Error processing ${mdFileName}:`, error);
        }
    });
});
