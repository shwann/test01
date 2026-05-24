package com.example.test01;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Executors;

public class TestWebServer {
    private final HttpServer server;

    private TestWebServer(HttpServer server) {
        this.server = server;
    }

    public static TestWebServer create(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        TestWebServer app = new TestWebServer(server);
        app.registerRoutes();
        server.setExecutor(Executors.newFixedThreadPool(8));
        return app;
    }

    public static void main(String[] args) throws IOException {
        int port = resolvePort(args);
        TestWebServer app = create(port);
        app.start();
        System.out.println("test01 Java web service started on http://localhost:" + app.getPort());
    }

    public void start() {
        server.start();
    }

    public void stop() {
        server.stop(0);
    }

    public int getPort() {
        return server.getAddress().getPort();
    }

    private void registerRoutes() {
        server.createContext("/", routeExchange());
        server.createContext("/health", routeExchange());
        server.createContext("/api/info", routeExchange());
        server.createContext("/api/hello", routeExchange());
        server.createContext("/api/sum", routeExchange());
        server.createContext("/api/echo", routeExchange());
    }

    public static ApiResponse handleRequest(String method, String path, String rawQuery, String requestBody) {
        try {
            if ("/".equals(path)) {
                requireMethod(method, "GET");
                return ApiResponse.json(200, "{\"service\":\"test01-java-web\",\"message\":\"Welcome\"}");
            }
            if ("/health".equals(path)) {
                requireMethod(method, "GET");
                return ApiResponse.json(200, "{\"status\":\"ok\",\"service\":\"test01-java-web\",\"timestamp\":\""
                        + escapeJson(Instant.now().toString()) + "\"}");
            }
            if ("/api/info".equals(path)) {
                requireMethod(method, "GET");
                return ApiResponse.json(200,
                        "{\"service\":\"test01-java-web\",\"version\":\"1.0.0\","
                                + "\"endpoints\":[\"GET /health\",\"GET /api/info\",\"GET /api/hello?name=Codex\","
                                + "\"GET /api/sum?a=1&b=2\",\"POST /api/echo\"]}");
            }
            if ("/api/hello".equals(path)) {
                requireMethod(method, "GET");
                Map<String, String> query = parseQuery(rawQuery);
                String name = query.getOrDefault("name", "World").trim();
                if (name.isEmpty()) {
                    name = "World";
                }
                return ApiResponse.json(200, "{\"message\":\"Hello, " + escapeJson(name) + "!\"}");
            }
            if ("/api/sum".equals(path)) {
                requireMethod(method, "GET");
                Map<String, String> query = parseQuery(rawQuery);
                double a = parseRequiredNumber(query, "a");
                double b = parseRequiredNumber(query, "b");
                return ApiResponse.json(200, "{\"a\":" + formatNumber(a) + ",\"b\":" + formatNumber(b)
                        + ",\"sum\":" + formatNumber(a + b) + "}");
            }
            if ("/api/echo".equals(path)) {
                requireMethod(method, "POST");
                String body = requestBody == null ? "" : requestBody;
                return ApiResponse.json(200, "{\"method\":\"POST\",\"length\":" + body.length()
                        + ",\"body\":\"" + escapeJson(body) + "\"}");
            }
            return ApiResponse.json(404, "{\"error\":\"Not Found\"}");
        } catch (BadRequestException ex) {
            return ApiResponse.json(400, "{\"error\":\"" + escapeJson(ex.getMessage()) + "\"}");
        } catch (MethodNotAllowedException ex) {
            return ApiResponse.json(405, "{\"error\":\"Method Not Allowed\",\"allowed\":\"" + ex.allowedMethod + "\"}",
                    ex.allowedMethod);
        } catch (Exception ex) {
            return ApiResponse.json(500, "{\"error\":\"Internal Server Error\"}");
        }
    }

    private static HttpHandler routeExchange() {
        return exchange -> {
            try {
                ApiResponse response = handleRequest(
                        exchange.getRequestMethod(),
                        exchange.getRequestURI().getPath(),
                        exchange.getRequestURI().getRawQuery(),
                        readBody(exchange));
                if (response.allowedMethod != null) {
                    exchange.getResponseHeaders().set("Allow", response.allowedMethod);
                }
                sendJson(exchange, response.statusCode, response.body);
            } finally {
                exchange.close();
            }
        };
    }

    private static void requireMethod(String actualMethod, String expectedMethod) {
        if (!expectedMethod.equalsIgnoreCase(actualMethod)) {
            throw new MethodNotAllowedException(expectedMethod);
        }
    }

    private static double parseRequiredNumber(Map<String, String> query, String key) {
        String value = query.get(key);
        if (value == null || value.isBlank()) {
            throw new BadRequestException("Missing required query parameter: " + key);
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException ex) {
            throw new BadRequestException("Query parameter must be numeric: " + key);
        }
    }

    private static Map<String, String> parseQuery(String rawQuery) {
        Map<String, String> values = new LinkedHashMap<>();
        if (rawQuery == null || rawQuery.isBlank()) {
            return values;
        }
        for (String pair : rawQuery.split("&")) {
            if (pair.isEmpty()) {
                continue;
            }
            String[] parts = pair.split("=", 2);
            String key = urlDecode(parts[0]);
            String value = parts.length > 1 ? urlDecode(parts[1]) : "";
            values.put(key, value);
        }
        return values;
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream input = exchange.getRequestBody()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static void sendJson(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }

    private static String escapeJson(String value) {
        StringBuilder escaped = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            switch (ch) {
                case '"':
                    escaped.append("\\\"");
                    break;
                case '\\':
                    escaped.append("\\\\");
                    break;
                case '\n':
                    escaped.append("\\n");
                    break;
                case '\r':
                    escaped.append("\\r");
                    break;
                case '\t':
                    escaped.append("\\t");
                    break;
                default:
                    if (ch < 0x20) {
                        escaped.append(String.format("\\u%04x", (int) ch));
                    } else {
                        escaped.append(ch);
                    }
            }
        }
        return escaped.toString();
    }

    private static String formatNumber(double value) {
        if (value == Math.rint(value)) {
            return Long.toString((long) value);
        }
        return Double.toString(value);
    }

    private static int resolvePort(String[] args) {
        if (args.length > 0 && !args[0].isBlank()) {
            return Integer.parseInt(args[0]);
        }
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.isBlank()) {
            return Integer.parseInt(envPort);
        }
        return 8080;
    }

    public static class ApiResponse {
        public final int statusCode;
        public final String body;
        public final String allowedMethod;

        private ApiResponse(int statusCode, String body, String allowedMethod) {
            this.statusCode = statusCode;
            this.body = body;
            this.allowedMethod = allowedMethod;
        }

        private static ApiResponse json(int statusCode, String body) {
            return new ApiResponse(statusCode, body, null);
        }

        private static ApiResponse json(int statusCode, String body, String allowedMethod) {
            return new ApiResponse(statusCode, body, allowedMethod);
        }
    }
    private static class BadRequestException extends RuntimeException {
        BadRequestException(String message) {
            super(message);
        }
    }

    private static class MethodNotAllowedException extends RuntimeException {
        private final String allowedMethod;

        MethodNotAllowedException(String allowedMethod) {
            this.allowedMethod = allowedMethod;
        }
    }
}
