package com.example.test01;

public class TestWebServerTest {
    public static void main(String[] args) {
        assertResponse("root", TestWebServer.handleRequest("GET", "/", null, null), 200, "\"message\":\"Welcome\"");
        assertResponse("health", TestWebServer.handleRequest("GET", "/health", null, null), 200, "\"status\":\"ok\"");
        assertResponse("info", TestWebServer.handleRequest("GET", "/api/info", null, null), 200,
                "\"version\":\"1.0.0\"");
        assertResponse("hello", TestWebServer.handleRequest("GET", "/api/hello", "name=Codex", null), 200,
                "\"message\":\"Hello, Codex!\"");
        assertResponse("hello default", TestWebServer.handleRequest("GET", "/api/hello", null, null), 200,
                "\"message\":\"Hello, World!\"");
        assertResponse("sum", TestWebServer.handleRequest("GET", "/api/sum", "a=7&b=5.5", null), 200,
                "\"sum\":12.5");
        assertResponse("echo", TestWebServer.handleRequest("POST", "/api/echo", null, "hello java"), 200,
                "\"body\":\"hello java\"");
        assertResponse("bad request", TestWebServer.handleRequest("GET", "/api/sum", "a=abc&b=1", null), 400,
                "Query parameter must be numeric");
        assertResponse("method not allowed", TestWebServer.handleRequest("GET", "/api/echo", null, null), 405,
                "Method Not Allowed");
        assertResponse("not found", TestWebServer.handleRequest("GET", "/missing", null, null), 404, "Not Found");

        System.out.println("All API tests passed.");
    }

    private static void assertResponse(String caseName, TestWebServer.ApiResponse response, int expectedStatus,
            String expectedBodyPart) {
        if (response.statusCode != expectedStatus) {
            throw new AssertionError(caseName + " expected HTTP " + expectedStatus + " but got "
                    + response.statusCode + ": " + response.body);
        }
        if (!response.body.contains(expectedBodyPart)) {
            throw new AssertionError(caseName + " expected response body to contain " + expectedBodyPart
                    + " but got: " + response.body);
        }
    }
}
