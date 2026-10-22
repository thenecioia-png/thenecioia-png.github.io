import numpy as np
from PIL import Image
from scipy import ndimage

src = r"C:\Users\susecomp\Downloads\Sprite de diablillo rojo en movimiento.png"
img = Image.open(src).convert("RGB")
a = np.array(img).astype(np.int32)
H, W, _ = a.shape

COLS, ROWS = 4, 3
cw, ch = W // COLS, H // ROWS   # 362 x 362
print("cell", cw, ch)

frames = []
for r in range(ROWS):
    for c in range(COLS):
        x0, y0 = c*cw, r*ch
        cell = a[y0:y0+ch, x0:x0+cw].copy()
        # background = near-white pixels connected to the border
        nearwhite = (cell[...,0] > 225) & (cell[...,1] > 225) & (cell[...,2] > 225)
        lbl, n = ndimage.label(nearwhite)
        # labels touching the border
        border_labels = set()
        border_labels.update(lbl[0,:]); border_labels.update(lbl[-1,:])
        border_labels.update(lbl[:,0]); border_labels.update(lbl[:,-1])
        bgmask = np.isin(lbl, list(border_labels))
        # build RGBA with transparent bg
        rgba = np.dstack([cell, np.where(bgmask, 0, 255)]).astype(np.uint8)
        frames.append(rgba)

# autocrop each to content bbox
boxes = []
for fr in frames:
    alpha = fr[...,3]
    ys, xs = np.where(alpha > 0)
    boxes.append((xs.min(), ys.min(), xs.max()+1, ys.max()+1))

# global canvas = max content size + small padding, centered
maxw = max(b[2]-b[0] for b in boxes)
maxh = max(b[3]-b[1] for b in boxes)
print("max content", maxw, maxh)

SIZE = 300  # fixed square canvas
canvas_frames = []
for fr, (x0,y0,x1,y1) in zip(frames, boxes):
    crop = fr[y0:y1, x0:x1]
    cimg = Image.fromarray(crop, "RGBA")
    # scale to fit SIZE while keeping aspect
    w = x1-x0; h = y1-y0
    scale = (SIZE*0.92) / max(w, h)
    nw, nh = max(1,int(w*scale)), max(1,int(h*scale))
    cimg = cimg.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0,0,0,0))
    # anchor to bottom-center (feet at bottom, consistent for walking)
    ox = (SIZE - nw)//2
    oy = SIZE - nh - 4
    canvas.paste(cimg, (ox, oy), cimg)
    canvas_frames.append(canvas)

# save individual frames + strip
import os
os.makedirs("frames", exist_ok=True)
for i, cf in enumerate(canvas_frames):
    cf.save(f"frames/frame_{i:02d}.png")

strip = Image.new("RGBA", (SIZE*12, SIZE), (0,0,0,0))
for i, cf in enumerate(canvas_frames):
    strip.paste(cf, (i*SIZE, 0), cf)
strip.save("diablito-sprite.png")
print("saved diablito-sprite.png", strip.size)
# also a bigger version for hero
