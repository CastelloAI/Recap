#!/usr/bin/env bash
set -euo pipefail

cat <<'HEAD' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Earnings Recaps</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      min-height: 100vh;
      padding: 3rem 1.5rem;
    }
    h1 {
      text-align: center;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 2.5rem;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      max-width: 960px;
      margin: 0 auto;
    }
    a.card {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1.25rem 1rem;
      background: #161616;
      border: 1px solid #252525;
      border-radius: 10px;
      color: #e0e0e0;
      text-decoration: none;
      font-weight: 500;
      font-size: 1.05rem;
      transition: background 0.15s, border-color 0.15s;
    }
    a.card:hover {
      background: #1e1e1e;
      border-color: #3a3a3a;
      color: #fff;
    }
    .ticker { font-weight: 700; font-size: 1.15rem; }
  </style>
</head>
<body>
  <h1>Earnings Recaps</h1>
  <div class="grid">
HEAD

for dir in */; do
  dir="${dir%/}"

  [[ "$dir" == .* ]] && continue

  # each folder must have an index.html
  [ -f "$dir/index.html" ] || continue

  echo "    <a class=\"card\" href=\"/$dir/\"><div class=\"ticker\">$dir</div></a>"
done | sort >> index.html

cat <<'TAIL' >> index.html
  </div>
</body>
</html>
TAIL

echo "Built index.html with $(grep -c 'class="card"' index.html) links"
