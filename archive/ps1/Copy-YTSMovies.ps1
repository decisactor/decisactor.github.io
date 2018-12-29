

$movieFolders = (Get-ChildItem "$Home\Downloads\Videos" -Directory).Where{ $_.BaseName -match "\((19|20)\d{2}\)" }
foreach ($movieFolder in $movieFolders) {
    $mp4 = $movieFolder.GetFiles("*.mp4")[0]
    $newName = $mp4.Name -replace ".1080p.*(?=\.mp4)"
    Write-Host $newName

    Move-Item -LiteralPath $mp4.FullName "$Home\Downloads\Movies\$newName" | Out-Null
    Remove-Item -LiteralPath $movieFolder.FullName -Force
}
