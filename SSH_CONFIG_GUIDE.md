# SSH 私钥配置指南

## 步骤1：准备SSH私钥文件

你需要从你的本地机器（Jack's laptop）获取SSH私钥文件。私钥文件通常是：
- `~/.ssh/id_rsa` (RSA密钥)
- `~/.ssh/id_ed25519` (Ed25519密钥，更推荐)

## 步骤2：将私钥复制到当前环境

### 方法A：直接复制私钥内容

1. 在你的本地机器上查看私钥：
```bash
cat ~/.ssh/id_rsa
# 或
cat ~/.ssh/id_ed25519
```

2. 在当前环境中创建私钥文件：
```bash
# 创建私钥文件（将内容粘贴进去）
nano ~/.ssh/id_rsa
# 或
nano ~/.ssh/id_ed25519
```

3. 设置正确的权限：
```bash
chmod 600 ~/.ssh/id_rsa  # 私钥必须是600权限
# 或
chmod 600 ~/.ssh/id_ed25519
```

### 方法B：使用scp复制（如果两台机器可以连接）

```bash
# 从本地机器执行
scp ~/.ssh/id_rsa user@devbox:/home/devbox/.ssh/id_rsa
```

## 步骤3：配置SSH

1. **添加GitHub到known_hosts**（已完成）：
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

2. **测试SSH连接**：
```bash
ssh -T git@github.com
```

如果成功，你会看到：
```
Hi Jack0527-base! You've successfully authenticated, but GitHub does not provide shell access.
```

## 步骤4：配置Git使用SSH

```bash
cd /home/devbox/project
git remote set-url origin git@github.com:Jack0527-base/AerospaceFront.git
git remote -v  # 验证URL已更改
```

## 步骤5：推送代码

```bash
cd /home/devbox/project
git push -u origin main
```

## 常见问题

### 问题1：权限被拒绝 (Permission denied)

**解决方案**：
```bash
# 确保私钥权限正确
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub  # 如果有公钥文件

# 确保SSH目录权限正确
chmod 700 ~/.ssh
```

### 问题2：多个SSH密钥

如果你有多个SSH密钥，可以创建 `~/.ssh/config` 文件：

```bash
cat > ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

### 问题3：SSH代理

如果需要使用SSH代理：
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

## 验证配置

运行以下命令验证一切正常：

```bash
# 1. 检查私钥权限
ls -la ~/.ssh/id_rsa

# 2. 测试GitHub连接
ssh -T git@github.com

# 3. 检查Git远程URL
cd /home/devbox/project
git remote -v

# 4. 尝试推送
git push -u origin main
```

## 安全提示

⚠️ **重要**：
- 永远不要分享你的私钥文件
- 私钥文件权限必须是 600（只有所有者可读）
- 不要将私钥提交到Git仓库
- 如果私钥泄露，立即在GitHub上删除并重新生成

