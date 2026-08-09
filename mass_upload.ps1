cd "C:\Users\Ganesh Nair\OneDrive\Desktop\vive coding\AURA-repo"

Write-Host "Pulling latest..."
git pull --rebase --autostash origin main

# 1. Purge old frontend
Write-Host "Removing existing frontend..."
git rm -r -q frontend/
git commit -m "Purge old frontend directory for hard reset"

# 2. Copy all files from vive coding
Write-Host "Copying fresh files from workspace..."
$source = "C:\Users\Ganesh Nair\OneDrive\Desktop\vive coding"
$dest = "C:\Users\Ganesh Nair\OneDrive\Desktop\vive coding\AURA-repo\frontend"

if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }

foreach ($dir in @("app", "components", "data", "public")) {
    if (Test-Path "$source\$dir") {
        Copy-Item -Path "$source\$dir" -Destination "$dest\$dir" -Recurse -Force
    }
}

foreach ($file in @("package.json", "package-lock.json", "tailwind.config.ts", "postcss.config.mjs", "next.config.mjs", "tsconfig.json", "README.md")) {
    if (Test-Path "$source\$file") {
        Copy-Item -Path "$source\$file" -Destination "$dest\$file" -Force
    }
}

# 3. Commit files individually
Write-Host "Committing files individually..."
$files = Get-ChildItem -Path $dest -File -Recurse

$adjectives = @("Add", "Implement", "Integrate", "Configure", "Setup", "Initialize", "Create", "Deploy", "Ship", "Establish", "Construct", "Assemble", "Draft", "Introduce", "Build", "Wire", "Inject")

foreach ($file in $files) {
    # Get relative path for git add
    $relPath = $file.FullName.Substring($dest.Length + 1).Replace('\', '/')
    $gitPath = "frontend/$relPath"
    
    git add "`"$gitPath`""
    
    $randomAdjective = $adjectives | Get-Random
    $commitMsg = "$randomAdjective $($file.Name) module"
    
    git commit -m "$commitMsg" -q
}

Write-Host "Pushing all commits to remote..."
git push origin main

Write-Host "Mass upload completed successfully."
