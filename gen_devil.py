#!/usr/bin/env python3
import os, json, sys, base64, urllib.request, urllib.error

key = os.environ.get("ANTHROPIC_API_KEY")
if not key:
    print("NO ANTHROPIC_API_KEY"); sys.exit(1)

prompt = (
    "Generate an image: a cute-but-angry cartoon little red devil mascot, full body, "
    "chibi kawaii style, flat vector clipart with clean bold black outlines and soft cell "
    "shading. Round head, two small curved horns, big angry eyebrows, grumpy pouting face "
    "with small fangs, tiny bat-like wings, long pointed tail with arrow tip, small hooves. "
    "Bright red skin, cream belly and inner ears. Centered, standing, facing forward, full "
    "character visible, no cropping, no text, no watermark, no logo. Isolated on a plain "
    "solid white background."
)

payload = {
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 4096,
    "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
}

req = urllib.request.Request(
    "https://api.anthropic.com/v1/messages",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json", "x-api-key": key,
             "anthropic-version": "2023-06-01"},
)
try:
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.load(r)
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:800]); sys.exit(1)

# inspect content blocks
saved = False
for block in data.get("content", []):
    t = block.get("type")
    if t == "image":
        src = block.get("source", {})
        b64 = src.get("data")
        mt = src.get("media_type", "image/png")
        ext = "png" if "png" in mt else "jpg"
        with open(f"diablito_gen.{ext}", "wb") as f:
            f.write(base64.b64decode(b64))
        print(f"saved diablito_gen.{ext}")
        saved = True
    elif t == "text":
        print("TEXT:", block.get("text", "")[:300])
    else:
        print("block type:", t)

if not saved:
    print("no image in response. keys:", json.dumps(data)[:500])
