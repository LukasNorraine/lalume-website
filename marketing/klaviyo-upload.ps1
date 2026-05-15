$apiKey = "pk_SjeQGU_ff425ff5a099f76d5b9caa65ad1cc64f1c"
$headers = @{
    "Authorization" = "Klaviyo-API-Key $apiKey"
    "revision"      = "2024-02-15"
    "Content-Type"  = "application/json"
}

$templates = @(
    @{ file = "welcome-1.html";       name = "LaLume - Welcome 1: Code + Brand Story" },
    @{ file = "welcome-2.html";       name = "LaLume - Welcome 2: Ingredients" },
    @{ file = "welcome-3.html";       name = "LaLume - Welcome 3: Guarantee" },
    @{ file = "welcome-4.html";       name = "LaLume - Welcome 4: Reviews" },
    @{ file = "welcome-5.html";       name = "LaLume - Welcome 5: Routine" },
    @{ file = "welcome-6.html";       name = "LaLume - Welcome 6: Last Reminder" },
    @{ file = "abandoned-cart-1.html"; name = "LaLume - Cart 1: Still Thinking?" },
    @{ file = "abandoned-cart-2.html"; name = "LaLume - Cart 2: Sensitive Skin" },
    @{ file = "abandoned-cart-3.html"; name = "LaLume - Cart 3: Final + COMEBACK5" },
    @{ file = "post-purchase-1.html"; name = "LaLume - PP 1: Usage Guide" },
    @{ file = "post-purchase-2.html"; name = "LaLume - PP 2: Check-In" },
    @{ file = "post-purchase-3.html"; name = "LaLume - PP 3: Review Request" },
    @{ file = "post-purchase-4.html"; name = "LaLume - PP 4: Bundles" },
    @{ file = "post-purchase-5.html"; name = "LaLume - PP 5: Win-Back" }
)

$emailsDir = "c:\Users\lukas\lalume-website\marketing\emails"
$results = @()

foreach ($t in $templates) {
    $html = [System.IO.File]::ReadAllText("$emailsDir\$($t.file)", [System.Text.Encoding]::UTF8)
    $body = @{
        data = @{
            type = "template"
            attributes = @{
                name = $t.name
                html = $html
            }
        }
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $resp = Invoke-RestMethod -Uri "https://a.klaviyo.com/api/templates/" -Method POST -Headers $headers -Body $body
        $id = $resp.data.id
        Write-Host "OK  $($t.name)  ->  $id"
        $results += "$($t.name): $id"
    } catch {
        Write-Host "ERR $($t.name): $_"
    }
}

Write-Host ""
Write-Host "=== Template IDs ==="
$results | ForEach-Object { Write-Host $_ }
