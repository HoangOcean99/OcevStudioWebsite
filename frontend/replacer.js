const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace Int.NumberFormat en-US USD to vi-VN VND
  content = content.replace(/new Intl\.NumberFormat\(['"]en-US['"], \{ style: ['"]currency['"], currency: ['"]USD['"] \}\)/g, 'new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })');

  // Replace USD labels
  content = content.replace(/\(USD\)/g, '(VNĐ)');
  content = content.replace(/Giá \(USD\)/g, 'Giá (VNĐ)');
  
  // Replace $ followed by { ... .toFixed(x)}
  content = content.replace(/\$\{([^}]+)\.toFixed\(\d+\)\}/g, (match, expr) => {
    return '{' + expr + '.toLocaleString("vi-VN")} ₫';
  });

  // What about $ without toFixed? e.g. ${outfit.price} -> ${outfit.price.toLocaleString("vi-VN")} ₫
  // Be careful with template literals like `${...formatCurrency...}`
  content = content.replace(/\$\{([^}]+?price[^}]+?)\}/g, (match, expr) => {
    if (!expr.includes('toLocaleString') && !expr.includes('formatCurrency')) {
      return '{' + expr + '.toLocaleString("vi-VN")} ₫';
    }
    return match;
  });
  
  // Handle case where they do >$ {price} or >${price} without curly braces wrapping the $
  content = content.replace(/>\$\s*\{([^}]+)\}/g, (match, expr) => {
    if (!expr.includes('toLocaleString') && !expr.includes('formatCurrency')) {
      return '>{' + expr + '.toLocaleString("vi-VN")} ₫';
    }
    return '>{' + expr + '} ₫';
  });
  
  // Handle hardcoded like >$0< -> >0 ₫<
  content = content.replace(/>\$0</g, '>0 ₫<');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
console.log('Done');
