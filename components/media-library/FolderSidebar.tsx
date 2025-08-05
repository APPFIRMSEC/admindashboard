"use client";

import { Folder, ChevronRight } from "lucide-react";
import { FolderItem } from "@/hooks/use-media-library";

interface FolderSidebarProps {
  folderTree: FolderItem[];
  currentPath: string;
  navigateToFolder: (path: string) => void;
}

export function FolderSidebar({
  folderTree,
  currentPath,
  navigateToFolder,
}: FolderSidebarProps) {
  const renderFolderTree = (folders: FolderItem[], level = 0) => {
    return folders.map((folder) => (
      <div key={folder.path} style={{ marginLeft: `${level * 1}rem` }}>
        <button
          onClick={() => navigateToFolder(folder.path)}
          className={`flex items-center gap-2 w-full p-2 rounded hover:bg-muted ${
            currentPath === folder.path ? "bg-muted" : ""
          }`}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              currentPath.startsWith(folder.path) ? "rotate-90" : ""
            }`}
          />
          <Folder className="h-4 w-4" />
          <span className="text-sm">{folder.name}</span>
        </button>
        {folder.children &&
          currentPath.startsWith(folder.path) &&
          renderFolderTree(folder.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => navigateToFolder("/")}
        className={`flex items-center gap-2 w-full p-2 rounded hover:bg-muted ${
          currentPath === "/" ? "bg-muted" : ""
        }`}
      >
        <Folder className="h-4 w-4" />
        <span className="text-sm font-semibold">Root</span>
      </button>
      {renderFolderTree(folderTree)}
    </div>
  );
}
