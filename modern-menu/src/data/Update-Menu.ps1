# Set the path to your React project directory
$ProjectDir = "D:\Work\LandingPage\Menu Projects\modern-menu"
Set-Location -Path $ProjectDir

# Check if there are any changes in the src/data folder (new JSON or images)
$Status = git status --short src/data/

if ($Status) {
    Write-Host "Changes detected in data. Pushing to GitHub..."
    
    # Add, commit, and push the new data
    git add src/data/*
    git commit -m "Auto-update menu data: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    
    Write-Host "Update triggered successfully. GitHub Actions will rebuild the site in 2 minutes."
} else {
    Write-Host "No menu updates found."
}