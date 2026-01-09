const fs = require('fs');
const path = require('path');

/**
 * 更新版本号
 * 读取 package.json 的版本号，同步到 public/sw.js
 */
function updateVersion() {
  // 路径配置
  const PATHS = {
    package: path.join(process.cwd(), 'package.json'),
    sw: path.join(process.cwd(), 'public/sw.js'),
  };

  try {
    // 读取 package.json
    const pkg = JSON.parse(fs.readFileSync(PATHS.package, 'utf8'));
    const version = pkg.version;
    const cacheVersion = `v${version.replace(/\./g, '_')}`; // e.g., 1.0.5 -> v1_0_5

    console.log(`Updating Service Worker to version ${version} (Cache: ${cacheVersion})...`);

    // 更新 public/sw.js
    let swContent = fs.readFileSync(PATHS.sw, 'utf8');

    // 更新 CACHE_NAME
    swContent = swContent.replace(
      /const CACHE_NAME = ['"]weiz-nav-v[^'"]+['"];/,
      `const CACHE_NAME = 'weiz-nav-${cacheVersion}';`
    );

    // 更新 RUNTIME_CACHE
    swContent = swContent.replace(
      /const RUNTIME_CACHE = ['"]weiz-nav-runtime-v[^'"]+['"];/,
      `const RUNTIME_CACHE = 'weiz-nav-runtime-${cacheVersion}';`
    );

    // 更新 IMAGE_CACHE
    swContent = swContent.replace(
      /const IMAGE_CACHE = ['"]weiz-nav-images-v[^'"]+['"];/,
      `const IMAGE_CACHE = 'weiz-nav-images-${cacheVersion}';`
    );

    fs.writeFileSync(PATHS.sw, swContent);
    console.log('✓ Updated public/sw.js');

    console.log('Version update complete!');
  } catch (error) {
    console.error('✗ Failed to update version:', error);
    process.exit(1);
  }
}

updateVersion();
