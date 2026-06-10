# 本地 HTTPS 开发环境配置

本项目使用 [mkcert](https://github.com/FiloSottile/mkcert) 生成本地受信任的 HTTPS 证书。

## 快速开始

### 1. 安装 mkcert

```bash
# macOS
brew install mkcert
brew install nss # 如果使用 Firefox

# Windows (使用 Chocolatey)
choco install mkcert

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

### 2. 生成证书

```bash
npm run generate-cert
```

这个命令会：
- 安装本地 CA（如果还没安装）
- 在 `certs/` 目录下生成证书文件
- 证书会被浏览器自动信任，无需手动操作

### 3. 启动 HTTPS 开发服务器

```bash
pnpm dev:https
```

服务器将在 `https://localhost:3000` 启动。

### 4. 访问

打开浏览器访问 `https://localhost:3000`，不会有任何安全警告！

## 为什么需要 HTTPS？

某些浏览器 API（如 EyeDropper API）只能在安全上下文（HTTPS 或 localhost）下使用。虽然 `http://localhost` 被认为是安全的，但某些功能可能仍然需要 HTTPS。

## 故障排除

### 证书生成失败

确保已安装 OpenSSL：
- macOS: `brew install openssl`
- Windows: 下载并安装 https://slproweb.com/products/Win32OpenSSL.html
- Linux: `sudo apt-get install openssl`

### 端口已被占用

如果 3000 端口被占用，可以修改 `server.js` 中的 `port` 变量。

### 浏览器仍然显示不安全

这是正常的，因为是自签名证书。你可以：
1. 按照上面的步骤信任证书
2. 或者使用 mkcert 生成受信任的证书
3. 或者在浏览器中点击"继续访问"（仅用于开发）

## 恢复 HTTP 开发

如果想恢复使用 HTTP：

```bash
pnpm dev
```

这会在 `http://localhost:3000` 启动开发服务器。
