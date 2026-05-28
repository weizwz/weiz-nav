const fs = require('fs');
const path = require('path');

/**
 * 更新版本号
 * 读取 package.json 的版本号，根据 scripts/sw-template.js 生成 public/sw.js
 */
function updateVersion() {
  // 路径配置
  const PATHS = {
    package: path.join(process.cwd(), 'package.json'),
    template: path.join(process.cwd(), 'scripts/sw-template.js'),
    sw: path.join(process.cwd(), 'public/sw.js'),
  };

  try {
    // 读取 package.json
    const pkg = JSON.parse(fs.readFileSync(PATHS.package, 'utf8'));
    const version = pkg.version;
    const cacheVersion = `v${version.replace(/\./g, '_')}`; // e.g., 1.0.5 -> v1_0_5

    console.log(`Updating Service Worker to version ${version} (Cache: ${cacheVersion})...`);

    // 读取模板文件
    if (!fs.existsSync(PATHS.template)) {
      throw new Error('Service Worker template not found: ' + PATHS.template);
    }
    let swContent = fs.readFileSync(PATHS.template, 'utf8');

    // 替换版本号占位符
    swContent = swContent.replace(/{{VERSION}}/g, cacheVersion);

    // 写入 public/sw.js
    fs.writeFileSync(PATHS.sw, swContent);
    console.log('✓ Generated public/sw.js from template');

    console.log('Version update complete!');
  } catch (error) {
    console.error('✗ Failed to update version:', error);
    process.exit(1);
  }
}

updateVersion();
