# test01

一个零依赖 Java Web 服务示例，使用 JDK 自带的 `HttpServer` 实现测试 API。

## 接口

- `GET /health`: 健康检查
- `GET /api/info`: 服务信息和接口列表
- `GET /api/hello?name=Codex`: 返回问候语
- `GET /api/sum?a=1&b=2`: 计算两个数字的和
- `POST /api/echo`: 原样返回请求体内容

## 编译

```bash
mkdir -p out
javac -d out $(find src/main/java src/test/java -name '*.java')
```

## 运行服务

```bash
java -cp out com.example.test01.TestWebServer 8080
```

也可以通过环境变量指定端口：

```bash
PORT=8080 java -cp out com.example.test01.TestWebServer
```

## 验证接口

运行内置测试：

```bash
java -cp out com.example.test01.TestWebServerTest
```

手动请求示例：

```bash
curl http://localhost:8080/health
curl 'http://localhost:8080/api/hello?name=Codex'
curl 'http://localhost:8080/api/sum?a=7&b=5.5'
curl -X POST http://localhost:8080/api/echo -d 'hello java'
```
