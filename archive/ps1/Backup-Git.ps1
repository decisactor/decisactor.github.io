
$folders = "OneDrive", "Google Drive", "iCloudDrive", "Box Sync"
(Get-PSDrive -PSProvider FileSystem).Root.ForEach{
    if ( (Test-Path $_) -and ($_ | Get-ChildItem).Name.Contains("Android") ) { $folders += , $_ -replace "\\$" }
}

$folders.ForEach{
    $root = if ($_ -notmatch ":") { "$HOME\$_\github\" } else { "$_\github\" }
    if (!(Test-Path $root)) { 
        New-Item $root -ItemType Directory | Out-Null
        (Get-ChildItem "C:\github" -Recurse).ForEach{
            Copy-Item $_ $_.Replace("C:", "$HOME\$_")
        }
    }
    else {
        (git status -s).ForEach{
            if ($_ -match "M ") { 
                $path = $root + ($_ -replace " \w ")
                Copy-Item $_.Replace($root, "C:\") $path
            }
        
            if ($root -match "decisact" -and $path -match ".html") {
                $content = (Get-Content $path).Replace("/index.js", "/storage/sdcard1/github/index.js")
                if (!$content) { continue }
                Set-Content $path $content
            }
        }
    }
}

<#
git fetch --all
git reset --hard origin/master

sl $HOME\Downloads\Media
git add .
git commit -m "update"
git push -u origin master 

sl C:\GitHub
git add .
git commit -m "update"
git push -u origin master 
#>
