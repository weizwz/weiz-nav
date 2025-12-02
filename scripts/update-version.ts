import fs from 'fs';
import path from 'path';

/**
 * 更新版本号
 * 读取 package.json 的版本号，同步到 public/version.json 和 public/sw.js
 */
export function updateVersion() {
  // 路径配置
  const PATHS = {
    package: path.join(process.cwd(), 'package.json'),
    version: path.join(process.cwd(), 'public/version.json'),
    sw: path.join(process.cwd(), 'public/sw.js'),
  };

  try {
    // 读取 package.json
    const pkg = JSON.parse(fs.readFileSync(PATHS.package, 'utf8'));
    const version = pkg.version;
    const cacheVersion = `v${version.replace(/\./g, '_')}`; // e.g., 1.0.5 -> v1_0_5

    // 1. 更新 public/version.json
    let versionData: any = {};
    if (fs.existsSync(PATHS.version)) {
      versionData = JSON.parse(fs.readFileSync(PATHS.version, 'utf8'));
    }

    // 检查是否需要更新
    if (versionData.version === version) {
      // 版本号相同，不更新
      return;
    }

    console.log(`Updating version to ${version} (Cache: ${cacheVersion})...`);

    versionData.version = version;
    versionData.buildTime = new Date().toISOString();
    versionData.cacheVersion = cacheVersion;

    fs.writeFileSync(PATHS.version, JSON.stringify(versionData, null, 2) + '\n');
    console.log('✓ Updated public/version.json');

    // 2. 更新 public/sw.js
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
    // 不抛出错误，以免影响构建流程
  }
}
