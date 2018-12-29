$apps = @()
$width = 420; $height = 200
$widthStep = 680; $heightStep = 165
$images = (Get-ChildItem "C:\github\archive\files\apps\*.PNG")

for ($k = 0; $k -lt $images.Count; $k++) {
    $path = $images[$k].FullName
    $img = New-Object System.Drawing.Bitmap($path)
    $start = if ($k -eq 0) { 240 } else { 250 }
    for ($i = $start; $i -lt $img.Height - 200; $i+=$heightStep) {
        for ($j = 170; $j -lt $img.Width; $j+=$widthStep) {
            $rect = New-Object System.Drawing.Rectangle $j,$i,$width,$height
            #$apps += , (Export-ImageText $path $rect) -replace "\|", "l" -replace "\n.*"
        }
    }
}
Set-Content "C:\github\archive\html\apps.html" ($apps | Sort-Object -Unique) -Encoding UTF8