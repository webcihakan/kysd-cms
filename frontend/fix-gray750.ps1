Get-ChildItem -Path "C:\Users\Huawei\Desktop\kysd-cms\frontend\src" -Recurse -Filter "*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($content -match "gray-750") {
        $newContent = $content -replace "gray-750", "gray-700"
        Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($_.Name)"
    }
}
Write-Host "Done!"
