const fs = require('fs');

const file = 'e:\\LamViec\\OcevStudio\\SourceCodeWebsite\\OcevStudioWebsite\\frontend\\src\\data\\productsData.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/category: 'streetwear' \| 'cyberpunk' \| 'minimalist' \| 'techwear'/g, "category: 'đồ nam' | 'đồ nữ' | 'đồ đôi'");
content = content.replace(/category: "streetwear"/g, 'category: "đồ nam"');
content = content.replace(/category: "cyberpunk"/g, 'category: "đồ nữ"');
content = content.replace(/category: "minimalist"/g, 'category: "đồ đôi"');
content = content.replace(/category: "techwear"/g, 'category: "đồ nam"');

content = content.replace(/category: 'streetwear'/g, "category: 'đồ nam'");
content = content.replace(/category: 'cyberpunk'/g, "category: 'đồ nữ'");
content = content.replace(/category: 'minimalist'/g, "category: 'đồ đôi'");
content = content.replace(/category: 'techwear'/g, "category: 'đồ nam'");

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
