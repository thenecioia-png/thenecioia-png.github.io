#!/usr/bin/env python3
"""Dibuja un diablito cartoon (chibi) limpio, sin marca de agua, con transparencia."""
from PIL import Image, ImageDraw, ImageFilter
import math

S = 1040  # draw at high res, downscale later for AA
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# ---- paleta ----
RED      = (216, 45, 40)
RED_DARK = (164, 26, 30)
RED_HI   = (240, 88, 78)
CREAM    = (255, 232, 200)
CREAM_DK = (238, 205, 168)
HORN     = (236, 188, 138)
HORN_DK  = (196, 148, 98)
OUTLINE  = (74, 18, 20, 255)
WHITE    = (255, 255, 255)
BLACK    = (28, 20, 24)
BLUSH    = (255, 150, 140)

def radial_ellipse(cx, cy, rx, ry, inner, outer):
    """dibuja elipse con gradiente radial de inner(centro) a outer(borde)."""
    steps = 40
    for i in range(steps, -1, -1):
        t = i / steps
        c = tuple(int(inner[j] + (outer[j] - inner[j]) * t) for j in range(3))
        rxi = rx * (1 - t * 0.4)
        ryi = ry * (1 - t * 0.4)
        d.ellipse([cx - rxi, cy - ryi, cx + rxi, cy + ryi], fill=c)

def poly_outline(points, fill, width=6, outline=OUTLINE):
    d.polygon(points, fill=fill, outline=outline)
    # redraw outline for thickness via draw.line over each edge
    for i in range(len(points)):
        d.line([points[i], points[(i+1) % len(points)]], fill=outline, width=width)

# ---- cuerpo (cabeza grande + cuerpo pequeño, chibi) ----
# centro vertical
cx = S // 2

# cuerpo (torso)
body_cx, body_cy, body_rx, body_ry = cx, 720, 300, 250
radial_ellipse(body_cx, body_cy, body_rx, body_ry, RED_HI, RED)
d.ellipse([body_cx - body_rx, body_cy - body_ry, body_cx + body_rx, body_cy + body_ry],
          outline=OUTLINE, width=8)

# cabeza (grande)
head_cx, head_cy, head_r = cx, 360, 380
radial_ellipse(head_cx, head_cy, head_r, head_r, RED_HI, RED)
d.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r],
          outline=OUTLINE, width=8)

# ---- cuernos ----
def horn(side):
    s = 1 if side == "L" else -1
    base_x = head_cx + s * 120
    base_y = head_cy - 300
    pts = [
        (base_x, base_y + 40),
        (base_x + s * 130, base_y - 150),
        (base_x + s * 230, base_y - 210),
        (base_x + s * 200, base_y - 40),
    ]
    d.polygon(pts, fill=HORN, outline=OUTLINE)
    # línea de detalle
    d.line([(base_x + s * 40, base_y - 20), (base_x + s * 150, base_y - 160)],
           fill=HORN_DK, width=10)
horn("L"); horn("R")

# ---- orejas (pequeñas, a los lados) ----
def ear(side):
    s = 1 if side == "L" else -1
    ex = head_cx + s * 340
    ey = head_cy + 60
    d.polygon([(ex - s*40, ey - 90), (ex + s*110, ey - 120), (ex + s*40, ey + 90)],
              fill=RED, outline=OUTLINE)
    d.polygon([(ex - s*10, ey - 40), (ex + s*70, ey - 60), (ex + s*10, ey + 50)],
              fill=RED_DARK)
ear("L"); ear("R")

# ---- alas (bat, detrás) ----
def wing(side):
    s = 1 if side == "L" else -1
    wx = body_cx + s * 290
    wy = body_cy - 60
    # membrana
    d.polygon([
        (body_cx + s*140, wy - 60),
        (wx, wy - 220),
        (wx + s*120, wy - 40),
        (wx + s*40, wy + 120),
        (body_cx + s*120, wy + 120),
    ], fill=RED_DARK, outline=OUTLINE)
wing("L"); wing("R")

# ---- cola con punta de flecha ----
def tail():
    # cola sale por abajo izquierda, se curva
    pts = [
        (body_cx - 220, body_cy + 180),
        (body_cx - 420, body_cy + 320),
        (body_cx - 380, body_cy + 480),
        (body_cx - 200, body_cy + 420),
    ]
    d.polygon(pts, fill=RED, outline=OUTLINE)
    # punta de flecha
    tx, ty = body_cx - 200, body_cy + 420
    d.polygon([(tx, ty - 70), (tx + 90, ty), (tx, ty + 70), (tx - 60, ty)],
              fill=RED_DARK, outline=OUTLINE)
tail()

# ---- piernas / pezuñas ----
def hoof(side):
    s = 1 if side == "L" else -1
    hx = body_cx + s * 130
    hy = body_cy + 230
    d.ellipse([hx - 70, hy - 60, hx + 70, hy + 80], fill=RED_DARK, outline=OUTLINE)
hoof("L"); hoof("R")

# ---- cara ----
# ojos (grandes, blancos)
eye_dx, eye_dy = 160, -40
eye_r = 95
for s in (-1, 1):
    ex, ey = head_cx + s*eye_dx, head_cy + eye_dy
    d.ellipse([ex - eye_r, ey - eye_r, ex + eye_r, ey + eye_r], fill=WHITE, outline=OUTLINE)
    # pupila
    d.ellipse([ex - 38, ey - 38, ex + 38, ey + 38], fill=BLACK)
    # brillo
    d.ellipse([ex - 26, ey - 52, ex - 2, ey - 28], fill=WHITE)

# cejas enojadas (inclinadas)
brow_w, brow_h = 130, 34
for s in (-1, 1):
    bx = head_cx + s*160
    by = head_cy - 160
    d.polygon([(bx - s*70, by + s*20), (bx + s*70, by - s*20),
               (bx + s*70, by - s*20 - brow_h), (bx - s*70, by + s*20 - brow_h)],
              fill=BLACK)

# boca (enojada/ceño)
mx, my = head_cx, head_cy + 200
d.arc([mx - 120, my - 40, mx + 120, my + 80], start=20, end=160, fill=OUTLINE, width=14)
# colmillo
d.polygon([(mx - 60, my + 40), (mx - 90, my + 80), (mx - 30, my + 55)], fill=WHITE, outline=OUTLINE)
d.polygon([(mx + 60, my + 40), (mx + 90, my + 80), (mx + 30, my + 55)], fill=WHITE, outline=OUTLINE)

# rubor
for s in (-1, 1):
    rx = head_cx + s*270
    ry = head_cy + 170
    d.ellipse([rx - 50, ry - 30, rx + 50, ry + 30], fill=BLUSH)

# ---- panza (cream) ----
belly_cy = body_cy + 40
d.ellipse([body_cx - 150, belly_cy - 120, body_cx + 150, belly_cy + 130],
          fill=CREAM, outline=CREAM_DK)

# ---- brazos / manos ----
def arm(side):
    s = 1 if side == "L" else -1
    ax = body_cx + s * 260
    ay = body_cy - 20
    d.ellipse([ax - 55, ay - 40, ax + 55, ay + 90], fill=RED, outline=OUTLINE)
arm("L"); arm("R")

# downscale con antialiasing
img = img.resize((520, 520), Image.LANCZOS)
img.save("diablito_drawn.png")
print("saved diablito_drawn.png")
