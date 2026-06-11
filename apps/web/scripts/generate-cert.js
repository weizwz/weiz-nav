const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, '..', 'certs');

// 创建 certs 目录
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

console.log('🔐 使用 mkcert 生成本地 HTTPS 证书...\n');

// 检查 mkcert 是否已安装
try {
  execSync('mkcert -version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ mkcert 未安装！\n');
  console.log('请先安装 mkcert:');
  console.log('- macOS:    brew install mkcert');
  console.log('- Windows:  choco install mkcert');
  console.log('- Linux:    参考 https://github.com/FiloSottile/mkcert#installation\n');
  process.exit(1);
}

try {
  // 安装本地 CA（如果还没安装）
  console.log('📦 安装本地 CA...');
  execSync('mkcert -install', { stdio: 'inherit' });
  
  // 生成证书
  console.log('\n🔑 生成证书...');
  const keyFile = path.join(certDir, 'localhost-key.pem');
  const certFile = path.join(certDir, 'localhost.pem');
  
  execSync(
    `mkcert -key-file "${keyFile}" -cert-file "${certFile}" localhost 127.0.0.1 ::1`,
    { stdio: 'inherit' }
  );
  
  console.log('\n✅ 证书生成成功！');
  console.log(`📁 证书位置: ${certDir}`);
  console.log('   - localhost-key.pem (私钥)');
  console.log('   - localhost.pem (证书)');
  console.log('\n🚀 现在可以运行以下命令启动 HTTPS 开发服务器:');
  console.log('   npm run dev:https');
  console.log('\n🌐 访问: https://localhost:3000');
} catch (error) {
  console.error('\n❌ 证书生成失败:', error.message);
  process.exit(1);
}
