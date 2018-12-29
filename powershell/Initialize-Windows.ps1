
$VMFlag = (Get-CimInstance Win32_ComputerSystem).Model -match "VMWare"
$PCFlag = (Get-CimInstance Win32_LogicalDisk).Size[0] / (2 -shl 29) -gt 60
$GPUFlag = ((Get-CimInstance Win32_VideoController).Name -join "\n") -match "nvidia"

# Copy Files
(Get-PSDrive -PSProvider FileSystem).Root.ForEach{
    if ( (Test-Path $_) -and ($_ | Get-ChildItem).Name.Contains("Downloads") -and !$VMFlag) { 
        (Get-ChildItem "$_\Downloads\").ForEach{
            if ($_.Name -match "GitHub") {
                Copy-Item $_.FullName "C:\" -Recurse
            }
        }
    }
}

# Installation
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

$programs = "git", "nodejs", "vscode", "7zip", "googlechrome"
if ($GPUFlag) { $programs += , "nvidia-display-driver" }
if ($VMFlag) { $programs += , "rufus" }
if ($PCFlag) { 
    $programs += , "utorrent", "vlc", "itunes", "boxsync", "virtualbox", "steam", "vmwareworkstation"#, "firefox", "icloud", "teamviewer", "dotnetcore", "anaconda3"
}

$programs.ForEach{
    $program = $_
    cinst.exe $program -y # yes
    if ($program -match "vscode") {
        # Install Extensions
        $extensions = "akamud.vscode-theme-onedark", "dbaeumer.vscode-eslint", "donjayamanne.jquerysnippets", "eamodio.gitlens", "GrapeCity.gc-excelviewer", "HookyQR.beautify", "ms-vscode.PowerShell", "PKief.material-icon-theme", "zhuangtongfa.material-theme"
        $extensions.ForEach{
            $extension = $_
            Write-Host "Installing $_..."
            code.cmd --install-extension $extension
        }
        # Change Settings
        $settings = '{
            "editor.wordWrap": "on",
    
            "html.format.wrapLineLength": 0,
    
            "files.autoSave": "afterDelay",
            "files.exclude": {
                "**/*.mp3": true,
                "**/*.jpg": true,
                "**/*Prin*.txt": true
            },
    
            "workbench.iconTheme": "material-icon-theme",
            "workbench.colorTheme": "One Dark Pro",
    
            "[html]": {
                "editor.tabSize": 2
            }
        }'
        Set-Content "$env:APPDATA\Code\User\settings.json" $settings
        code.cmd "C:\GitHub"
    }
    elseif ($program -match "git") {
        New-Item C:\GitHub -ItemType Directory
        Set-Location "C:\GitHub"
        $user = if ($VMFlag) {"decisacters"} else {"decisactor"}
        git.exe config --global user.email "$user-@example.com"
        git.exe config --global user.name $user
        if ($VMFlag) {
            git.exe init
            git.exe remote add origin "https://github.com/$($user)/$($user).github.io.git"
            git.exe pull origin master
        }
        Copy-Item C:\GitHub\index.js C:\
    }
    elseif ($program -match "nodejs") {
        $packages = "tesseract.js puppeteer cheerio request"
        Start-Process PowerShell "npm i $packages -g" # -g global
    }
}
