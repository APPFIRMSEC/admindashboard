# API Documentation

## Overview

This document describes all available API endpoints for the Admin Dashboard. All endpoints require authentication unless otherwise specified.

## Authentication

All API requests must include a valid session cookie. Authentication is handled by NextAuth.js.

## Base URL

```
http://localhost:3000/api
```

---

## Users API

### List Users

**GET** `/api/users`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name or email
- `role` (optional): Filter by role (ADMIN, EDITOR, AUTHOR, or "all")

**Headers:**

```
Authorization: Bearer <session_token>
```

**Response:**

```json
{
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-15T09:00:00Z",
      "_count": {
        "blogPosts": 5,
        "podcasts": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Status Codes:**

- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (requires ADMIN role)
- `500`: Server error

---

### Create User

**POST** `/api/users`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <session_token>
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123",
  "role": "AUTHOR",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "id": "new_user_id",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "AUTHOR",
  "status": "ACTIVE",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**

- `201`: Created successfully
- `400`: Validation error or email already exists
- `401`: Unauthorized
- `403`: Forbidden (requires ADMIN role)
- `500`: Server error

---

### Get User

**GET** `/api/users/{id}`

**Response:**

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-01-15T09:00:00Z",
  "_count": {
    "blogPosts": 5,
    "podcasts": 2,
    "mediaFiles": 3
  }
}
```

**Status Codes:**

- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (requires ADMIN role)
- `404`: User not found
- `500`: Server error

---

### Update User

**PATCH** `/api/users/{id}`

**Request Body:**

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "EDITOR",
  "status": "ACTIVE",
  "avatar": "https://example.com/new-avatar.jpg",
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "id": "user_id",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "EDITOR",
  "status": "ACTIVE",
  "avatar": "https://example.com/new-avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-01-15T09:00:00Z"
}
```

**Status Codes:**

- `200`: Updated successfully
- `400`: Validation error or email already exists
- `401`: Unauthorized
- `403`: Forbidden (requires ADMIN role)
- `404`: User not found
- `500`: Server error

---

### Delete User

**DELETE** `/api/users/{id}`

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

**Status Codes:**

- `200`: Deleted successfully
- `400`: Cannot delete last admin
- `401`: Unauthorized
- `403`: Forbidden (requires ADMIN role)
- `404`: User not found
- `500`: Server error

---

## Blogs API

### List Blog Posts

**GET** `/api/blogs`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for title, excerpt, or content
- `status` (optional): Filter by status (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED, or "all")
- `author` (optional): Filter by author name

**Response:**

```json
{
  "blogs": [
    {
      "id": "blog_id",
      "title": "Getting Started with Next.js 15",
      "slug": "getting-started-nextjs-15",
      "excerpt": "Learn how to build modern web applications...",
      "content": "Full blog post content...",
      "status": "PUBLISHED",
      "featuredImage": "https://example.com/image.jpg",
      "publishedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "seoTitle": "SEO Title",
      "seoDescription": "SEO Description",
      "seoKeywords": "nextjs,react,web development",
      "views": 1234,
      "readTime": 5,
      "author": {
        "id": "author_id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar.jpg"
      },
      "tags": [
        {
          "id": "tag_id",
          "name": "Next.js",
          "slug": "nextjs",
          "color": "#007acc"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Status Codes:**

- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

### Create Blog Post

**POST** `/api/blogs`

**Request Body:**

```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Brief description of the post",
  "content": "Full blog post content...",
  "status": "DRAFT",
  "featuredImage": "https://example.com/image.jpg",
  "publishDate": "2024-01-20T10:00:00Z",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": "keyword1,keyword2",
  "tags": ["Next.js", "React", "Web Development"]
}
```

**Response:**

```json
{
  "id": "new_blog_id",
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Brief description of the post",
  "content": "Full blog post content...",
  "status": "DRAFT",
  "featuredImage": "https://example.com/image.jpg",
  "publishedAt": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": "keyword1,keyword2",
  "views": 0,
  "readTime": null,
  "author": {
    "id": "author_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  "tags": [
    {
      "id": "tag_id",
      "name": "Next.js",
      "slug": "nextjs",
      "color": "#007acc"
    }
  ]
}
```

**Status Codes:**

- `201`: Created successfully
- `400`: Validation error or slug already exists
- `401`: Unauthorized
- `500`: Server error

---

### Get Blog Post

**GET** `/api/blogs/{id}`

**Response:**

```json
{
  "id": "blog_id",
  "title": "Getting Started with Next.js 15",
  "slug": "getting-started-nextjs-15",
  "excerpt": "Learn how to build modern web applications...",
  "content": "Full blog post content...",
  "status": "PUBLISHED",
  "featuredImage": "https://example.com/image.jpg",
  "publishedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": "nextjs,react,web development",
  "views": 1234,
  "readTime": 5,
  "author": {
    "id": "author_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  "tags": [
    {
      "id": "tag_id",
      "name": "Next.js",
      "slug": "nextjs",
      "color": "#007acc"
    }
  ]
}
```

**Status Codes:**

- `200`: Success
- `401`: Unauthorized
- `404`: Blog post not found
- `500`: Server error

---

### Update Blog Post

**PATCH** `/api/blogs/{id}`

**Request Body:**

```json
{
  "title": "Updated Blog Post Title",
  "slug": "updated-blog-post-slug",
  "excerpt": "Updated excerpt",
  "content": "Updated content...",
  "status": "PUBLISHED",
  "featuredImage": "https://example.com/new-image.jpg",
  "publishDate": "2024-01-20T10:00:00Z",
  "seoTitle": "Updated SEO Title",
  "seoDescription": "Updated SEO Description",
  "seoKeywords": "updated,keywords",
  "tags": ["Updated Tag", "New Tag"]
}
```

**Response:**

```json
{
  "id": "blog_id",
  "title": "Updated Blog Post Title",
  "slug": "updated-blog-post-slug",
  "excerpt": "Updated excerpt",
  "content": "Updated content...",
  "status": "PUBLISHED",
  "featuredImage": "https://example.com/new-image.jpg",
  "publishedAt": "2024-01-20T10:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  "seoTitle": "Updated SEO Title",
  "seoDescription": "Updated SEO Description",
  "seoKeywords": "updated,keywords",
  "views": 1234,
  "readTime": 5,
  "author": {
    "id": "author_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  "tags": [
    {
      "id": "tag_id",
      "name": "Updated Tag",
      "slug": "updated-tag",
      "color": "#007acc"
    }
  ]
}
```

**Status Codes:**

- `200`: Updated successfully
- `400`: Validation error or slug already exists
- `401`: Unauthorized
- `403`: Forbidden (only author or admin can edit)
- `404`: Blog post not found
- `500`: Server error

---

### Delete Blog Post

**DELETE** `/api/blogs/{id}`

**Response:**

```json
{
  "message": "Blog post deleted successfully"
}
```

**Status Codes:**

- `200`: Deleted successfully
- `401`: Unauthorized
- `403`: Forbidden (only author or admin can delete)
- `404`: Blog post not found
- `500`: Server error

---

## Authentication API

### NextAuth Endpoints

These endpoints are handled automatically by NextAuth.js:

- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/signout` - Sign out page
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

---

## Error Response Format

All endpoints return errors in a consistent format:

```json
{
  "error": "Error message description",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

CORS is configured for local development. Update CORS settings for production deployment.

---

## Testing

You can test these APIs using:

- Postman
- Insomnia
- curl commands
- Frontend application

Example curl command:

```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer <session_token>"
```
