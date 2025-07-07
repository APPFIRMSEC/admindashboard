"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText,
  Video,
  Download,
  ExternalLink
} from "lucide-react";

export function HelpSupport() {
  const faqs = [
    {
      question: "How do I create a new blog post?",
      answer: "Navigate to the Blog Posts section and click 'New Post'. Fill in the title, content, and other details, then save as draft or publish immediately."
    },
    {
      question: "How do I upload a podcast episode?",
      answer: "Go to the Podcasts section and click 'New Episode'. Upload your audio file, add episode details, and set the publishing status."
    },
    {
      question: "How do I manage media files?",
      answer: "Use the Media Library to upload, organize, and manage all your images, audio files, and documents. You can search, filter, and copy file URLs."
    },
    {
      question: "How do I change site settings?",
      answer: "Visit the Site Settings page to update your site information, contact details, social media links, and content configuration."
    },
    {
      question: "How do I add new users?",
      answer: "Go to the Users section and click 'Add User'. Set their role (admin, editor, or author) and send them an invitation email."
    }
  ];

  const resources = [
    {
      title: "User Guide",
      description: "Complete guide to using the admin dashboard",
      icon: BookOpen,
      href: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Video,
      href: "#"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      href: "#"
    },
    {
      title: "Download Manual",
      description: "PDF version of the user manual",
      icon: Download,
      href: "#"
    }
  ];

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with using the admin dashboard and find resources
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@mycompany.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/blogs/new">
                <FileText className="mr-2 h-4 w-4" />
                Create New Blog Post
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/podcasts/new">
                <FileText className="mr-2 h-4 w-4" />
                Upload Podcast Episode
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/media">
                <FileText className="mr-2 h-4 w-4" />
                Manage Media Files
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/settings">
                <FileText className="mr-2 h-4 w-4" />
                Update Site Settings
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Documentation</CardTitle>
          <CardDescription>
            Helpful guides and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Common questions and answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 