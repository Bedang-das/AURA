# Switch to the parent of the first commit we want to change
git checkout a64fad0~1

# 1. First commit
git cherry-pick a64fad0
git commit --amend -m "chore: Initialize frontend app layout and types"

# 2. Second commit
git cherry-pick 7e9ba9a
git commit --amend -m "feat: Build full frontend application with Tailwind and React components"

# 3. Third commit
git cherry-pick f5dd462
git commit --amend -m "chore: Clean up default Next.js README instructions"

# 4. Fourth commit
git cherry-pick cc6a96c
git commit --amend -m "style: Refine Navbar structure and alignment"

# 5. Fifth commit
git cherry-pick 6db32b6
git commit --amend -m "feat: Add glassmorphism animations and nested components structure"

# Force branch pointer to point here
git branch -f main HEAD

# Checkout main
git checkout main

# Force push to GitHub
git push --force origin main
