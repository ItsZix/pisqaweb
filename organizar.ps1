$htmlPath = "..\pisqa.html"
$outDir = "."
$cssDir = "$outDir\css"
$jsDir = "$outDir\js"

New-Item -ItemType Directory -Force -Path $cssDir | Out-Null
New-Item -ItemType Directory -Force -Path $jsDir | Out-Null

$content = Get-Content $htmlPath -Raw -Encoding UTF8

$cssMatch = [regex]::Match($content, '(?s)<style>(.*?)</style>')
if ($cssMatch.Success) {
    Set-Content -Path "$cssDir\style.css" -Value $cssMatch.Groups[1].Value -Encoding UTF8
    $content = $content -replace '(?s)<style>.*?</style>', '<link rel="stylesheet" href="css/style.css">'
}

$jsMatch = [regex]::Match($content, '(?s)<script type="module">(.*?)</script>')
if ($jsMatch.Success) {
    Set-Content -Path "$jsDir\app.js" -Value $jsMatch.Groups[1].Value -Encoding UTF8
    $content = $content -replace '(?s)<script type="module">.*?</script>', '<script type="module" src="js/app.js"></script>'
}

Set-Content -Path "$outDir\index.html" -Value $content -Encoding UTF8

# Limpiar archivos viejos de la carpeta anterior
Remove-Item "..\pisqa.html" -Force -ErrorAction SilentlyContinue
Remove-Item "..\pisqa_mejorado.html" -Force -ErrorAction SilentlyContinue
Remove-Item "..\organizar.bat" -Force -ErrorAction SilentlyContinue
Remove-Item "..\organizar.ps1" -Force -ErrorAction SilentlyContinue

Write-Host "Completado!"
