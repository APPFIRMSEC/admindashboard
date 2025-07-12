"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAPIPage() {
  const [results, setResults] = useState<{
    endpoint: string;
    method: string;
    status?: number;
    data?: unknown;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (
    endpoint: string,
    method = "GET",
    body?: Record<string, unknown>
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      setResults({ endpoint, method, status: response.status, data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setResults({ endpoint, method, error: errorMessage });
    }
    setLoading(false);
  };

  const createTestUser = () => {
    testAPI("/users", "POST", {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "password123",
      role: "AUTHOR",
    });
  };

  const createTestBlog = () => {
    testAPI("/blogs", "POST", {
      title: "Test Blog Post",
      slug: `test-blog-${Date.now()}`,
      content: "This is a test blog post content.",
      excerpt: "A test excerpt",
      status: "DRAFT",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Test Page</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User APIs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => testAPI("/users")}
              disabled={loading}
              className="w-full"
            >
              List Users
            </Button>
            <Button
              onClick={createTestUser}
              disabled={loading}
              className="w-full"
            >
              Create Test User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog APIs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => testAPI("/blogs")}
              disabled={loading}
              className="w-full"
            >
              List Blogs
            </Button>
            <Button
              onClick={createTestBlog}
              disabled={loading}
              className="w-full"
            >
              Create Test Blog
            </Button>
          </CardContent>
        </Card>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <strong>Endpoint:</strong> {results.endpoint}
              </p>
              <p>
                <strong>Method:</strong> {results.method}
              </p>
              {results.status && (
                <p>
                  <strong>Status:</strong> {results.status}
                </p>
              )}
              {results.error && (
                <p>
                  <strong>Error:</strong> {results.error}
                </p>
              )}
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
