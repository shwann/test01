# Codex 启动测试报告

## 结论

未能完成完整的浏览器启动验收。项目自带结构检查通过，且静态检查确认首页未出现禁用文案 `数珩企业`；但 executor 环境禁止本地端口监听，`npm start` 无法启动到 `http://127.0.0.1:4173`，因此桌面端和移动端浏览器检查及截图未能完成。

## 执行的启动命令

- `npm run check`
  - 结果：通过
  - 关键输出：`Homepage structure check passed.`

- `npm start`
  - 结果：失败
  - 错误：`listen EPERM: operation not permitted 127.0.0.1:4173`

- `HOST=localhost npm start`
  - 结果：失败
  - 错误：`listen EPERM: operation not permitted ::1:4173`

- `PORT=0 npm start`
  - 结果：失败
  - 错误：`listen EPERM: operation not permitted 127.0.0.1`

## 浏览器验证

- `home-desktop`：未完成
  - 目标 URL：`http://127.0.0.1:4173`
  - 原因：服务无法启动，本地监听被 executor 环境拦截。

- `home-mobile`：未完成
  - 目标 URL：`http://127.0.0.1:4173`
  - 原因：服务无法启动，本地监听被 executor 环境拦截。

- 替代验证：
  - `index.html`、`styles.css`、`main.js` 静态检查通过，未发现 `数珩企业`。
  - 首页文件中存在设计增强相关内容，例如 `SH Portal Command Center`、`客户场景`、`预约门户诊断`。

## 截图和证据

未能获取截图。原因如下：

- 项目服务无法监听 `127.0.0.1:4173`。
- 内置浏览器会话不可用：`Browser is not available: iab`。
- 本地 Playwright 不可用：`ERR_MODULE_NOT_FOUND`。

可用证据：

- `npm run check` 通过。
- 禁用文案检查通过：`数珩企业` 未出现在已检查产品文件中。
- `grep` 证据显示首页包含 `数珩科技`、`SH Portal Command Center`、`客户场景`、`预约门户诊断` 等页面内容。

## 进程清理

未发现需要清理的成功启动进程：

- 所有 `npm start` 尝试均因 `EPERM` 直接退出。
- `lsof -nP -iTCP:4173 -sTCP:LISTEN` 无监听输出。
- `ps` 检查在当前 executor 中被限制：`operation not permitted`。

## 风险和后续处理

当前最大风险是浏览器验收未能执行，无法确认真实渲染、控制台错误、页面错误、水平溢出和截图效果。

建议在允许本地端口监听的环境中重新执行：

```bash
npm start
```

然后访问：

```text
http://127.0.0.1:4173
```

并补做桌面端、移动端截图及控制台/水平溢出检查。