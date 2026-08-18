#!/usr/bin/env python3
"""Render an SVG (or HTML) to PNG at exact pixel size using headless Chromium.
    python3 render.py file.svg [out.png] [width]
"""
import re, subprocess, sys, os, shutil, tempfile
CHROME = "/Users/modernapex/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell"
src_path = os.path.abspath(sys.argv[1])
out = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.splitext(src_path)[0] + ".png"
if src_path.endswith(".svg"):
    src = open(src_path).read()
    vb = [float(x) for x in re.search(r'viewBox\s*=\s*"([\d.\-\s]+)"', src).group(1).split()]
    w, h = vb[2], vb[3]
    W = int(sys.argv[3]) if len(sys.argv) > 3 else int(w)
    H = round(W * h / w)
    html = f'<!doctype html><meta charset=utf-8><style>html,body{{margin:0;padding:0;background:#000}}svg{{display:block;width:{W}px;height:{H}px}}</style>{src}'
    tmp = tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, dir=os.path.dirname(src_path))
    tmp.write(html); tmp.close(); page = tmp.file.name if False else tmp.name
else:
    page = src_path
    W = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
    H = round(W * 0.62)
subprocess.run([CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
                f"--screenshot={out}", f"--window-size={W},{H}", "--default-background-color=00000000",
                "file://" + page], capture_output=True)
if src_path.endswith(".svg"): os.unlink(page)
from PIL import Image
print(out, Image.open(out).size)
