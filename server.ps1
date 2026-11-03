$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5173/")
$listener.Start()
Write-Host "HTTP Server started at http://localhost:5173/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $req = $context.Request
            $res = $context.Response
            $localPath = $req.Url.LocalPath
            if ($localPath -eq "/" -or [string]::IsNullOrEmpty($localPath)) {
                $localPath = "/index.html"
            }
            $filePath = "e:\Antigravity_work" + $localPath.Replace('/', '\')

            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                if ($filePath.EndsWith(".html")) {
                    $res.ContentType = "text/html; charset=utf-8"
                } elseif ($filePath.EndsWith(".css")) {
                    $res.ContentType = "text/css; charset=utf-8"
                } elseif ($filePath.EndsWith(".js")) {
                    $res.ContentType = "application/javascript; charset=utf-8"
                } elseif ($filePath.EndsWith(".json")) {
                    $res.ContentType = "application/json; charset=utf-8"
                } elseif ($filePath.EndsWith(".svg")) {
                    $res.ContentType = "image/svg+xml"
                } elseif ($filePath.EndsWith(".webp")) {
                    $res.ContentType = "image/webp"
                }
                $res.AddHeader("Access-Control-Allow-Origin", "*")
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
            }
        } catch {
            Write-Host "Request error: $_"
        } finally {
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
}
