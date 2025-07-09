#!/bin/bash
# resolve_conflicts_ours.sh
# Automatically resolve all merge conflicts in favor of local version (ours)

echo "🔧 Resolving all conflicts in favor of LOCAL version (ours)..."

# Get list of conflicted files
conflicted_files=$(git diff --name-only --diff-filter=U)

# Loop through and resolve each
for file in $conflicted_files; do
    echo "✅ Resolving: $file"
    git checkout --ours -- "$file"
    git add "$file"
done

echo "🎉 All conflicts resolved using local version."
git rebase --continue
