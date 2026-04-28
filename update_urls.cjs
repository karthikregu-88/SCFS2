const fs = require('fs');
const path = require('path');

const files = [
  'src/app/pages/OrdersPage.tsx',
  'src/app/pages/MenuPage.tsx',
  'src/app/components/StaffDashboard.tsx',
  'src/app/pages/LoginPage.tsx',
  'src/app/pages/CartPage.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('http://localhost:8000')) {
    // Replace standard fetch('http://localhost:8000/...') with fetch(`${API_BASE_URL}/...`)
    content = content.replace(/'http:\/\/localhost:8000([^']*)'/g, '`${API_BASE_URL}$1`');
    
    // Replace template literal fetch(`http://localhost:8000/...`) with fetch(`${API_BASE_URL}/...`)
    content = content.replace(/http:\/\/localhost:8000/g, '${API_BASE_URL}');
    
    // Depth calculation
    const depth = file.split('/').length - 3;
    const prefix = depth === 1 ? '../' : '../../';
    const importStmt = `import { API_BASE_URL } from '${prefix}config/api';\n`;
    
    // Add import after the first import
    const firstImportIndex = content.indexOf('\n', content.indexOf('import '));
    content = content.slice(0, firstImportIndex + 1) + importStmt + content.slice(firstImportIndex + 1);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
