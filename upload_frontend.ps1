cd "C:\Users\Ganesh Nair\OneDrive\Desktop\vive coding\AURA-repo"

$status = git status --porcelain -uall

# Convert string to array if only one line is returned
if ($status -is [string]) {
    $status = @($status)
}

if ($null -eq $status -or $status.Count -eq 0) {
    Write-Host "No files to commit."
    exit
}

# Find the first valid file that is in the frontend directory
$fileToCommit = $null
foreach ($line in $status) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    # Extract file path (skip the first 3 chars of status)
    $filePath = $line.Substring(3).Trim()
    
    # Remove quotes if git added them
    if ($filePath.StartsWith("`"")) {
        $filePath = $filePath.Substring(1, $filePath.Length - 2)
    }
    
    if ($filePath.StartsWith("frontend/")) {
        $fileToCommit = $filePath
        break
    }
}

if ($null -eq $fileToCommit) {
    Write-Host "No valid frontend files found to commit."
    exit
}

Write-Host "Staging file: $fileToCommit"
git add "`"$fileToCommit`""

$fileName = Split-Path $fileToCommit -Leaf
if ([string]::IsNullOrEmpty($fileName)) {
    $fileName = $fileToCommit
}

$adjectives = @("Refactor", "Enhance", "Update", "Fix", "Optimize", "Tweak", "Improve", "Adjust", "Revamp", "Polish", "Streamline", "Format", "Upgrade", "Modernize", "Rebuild")
$randomAdjective = $adjectives | Get-Random

$commitMsg = "$randomAdjective $fileName component - $(Get-Date -Format 'HH:mm:ss')"
Write-Host "Committing with message: $commitMsg"

git commit -m "$commitMsg"

Write-Host "Pulling remote changes before push..."
git pull --rebase --autostash origin main

git push origin main
Write-Host "Pushed $fileToCommit successfully."
