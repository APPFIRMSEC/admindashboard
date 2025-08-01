"use client";

import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentPath: string;
  navigateToFolder: (path: string) => void;
}

export function Breadcrumb({ currentPath, navigateToFolder }: BreadcrumbProps) {
  const getBreadcrumbItems = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Root", path: "/" }];

    let currentPathBuilder = "";
    pathParts.forEach((part) => {
      currentPathBuilder += `/${part}`;
      breadcrumbs.push({
        name: part.charAt(0).toUpperCase() + part.slice(1),
        path: currentPathBuilder,
      });
    });

    return breadcrumbs;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {getBreadcrumbItems().map((item, index) => (
        <div key={item.path} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
          <button
            onClick={() => navigateToFolder(item.path)}
            className={`hover:text-foreground ${
              currentPath === item.path
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
}
