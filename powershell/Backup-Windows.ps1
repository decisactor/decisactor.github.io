# vscode setup
$path = "$env:APPDATA\Code\User\settings.json"
$settings = Get-Content $path -Raw
$extensions = code.cmd --list-extensions


# js packages
$json = npm ls -g -json | ConvertFrom-Json
$packages = $json.dependencies | Get-Member -MemberType NoteProperty
$packages.Name -join " "