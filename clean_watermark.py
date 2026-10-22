import numpy as np
from PIL import Image, ImageFilter

src = "diablito_raw.png"
dst = "diablito_clean2.png"

img = Image.open(src).convert("RGBA")
arr = np.array(img).astype(np.float64)
r, g, b, al = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
H, W = r.shape

# body = opaque core
body = al >= 250

# dilate body to exclude its soft anti-aliased edge from the watermark region
bodymask = Image.fromarray((body * 255).astype(np.uint8))
dilated = np.array(bodymask.filter(ImageFilter.MaxFilter(25))).astype(bool)
# pure-watermark region = far outside dilated body
far = ~dilated

# watermark pixels = alpha>3 in the far region
wm_pix = far & (al > 3)
print("watermark sample px:", wm_pix.sum(), "of total", W*H)

P = 600
# build template by phase-averaging over the watermark sample
tpl_r = np.zeros((P, P)); tpl_g = np.zeros((P, P)); tpl_b = np.zeros((P, P)); tpl_a = np.zeros((P, P))
cnt = np.zeros((P, P))

ys, xs = np.where(wm_pix)
for y, x in zip(ys, xs):
    py, px = y % P, x % P
    tpl_r[py, px] += r[y, x]; tpl_g[py, px] += g[y, x]
    tpl_b[py, px] += b[y, x]; tpl_a[py, px] += al[y, x]
    cnt[py, px] += 1

c = np.maximum(cnt, 1)
tpl_r /= c; tpl_g /= c; tpl_b /= c; tpl_a /= c

# how many phases never got a sample?
print("phases with zero samples:", (cnt == 0).sum(), "/", P*P)
# variance of alpha per phase (consistency check)
tpl_a_var = np.zeros((P,P))
sq = np.zeros((P,P))
for y,x in zip(ys,xs):
    py,px = y%P, x%P
    sq[py,px] += (al[y,x]-tpl_a[py,px])**2
var = sq/np.maximum(cnt,1)
print("mean per-phase alpha stdev:", np.sqrt(var[cnt>0].mean()))

# reconstruct full watermark
full_a = tpl_a[np.arange(H)[:,None] % P, np.arange(W)[None,:] % P]
full_r = tpl_r[np.arange(H)[:,None] % P, np.arange(W)[None,:] % P]
full_g = tpl_g[np.arange(H)[:,None] % P, np.arange(W)[None,:] % P]
full_b = tpl_b[np.arange(H)[:,None] % P, np.arange(W)[None,:] % P]

# invert alpha-over compositing on body pixels where watermark present
a = full_a / 255.0
has_wm = full_a > 3
def invert(ch, wch):
    out = ch.copy()
    m = has_wm & (a < 0.9)
    out[m] = (ch[m] - wch[m]*a[m]) / (1.0 - a[m])
    return out
r2 = invert(r, full_r)
g2 = invert(g, full_g)
b2 = invert(b, full_b)

# keep body alpha; clear far region
al2 = al.copy()
al2[far & (full_a > 0)] = 0   # remove watermark from transparent bg entirely

out = np.stack([r2, g2, b2, al2], axis=-1)
out = np.clip(out, 0, 255).astype(np.uint8)
Image.fromarray(out, "RGBA").save(dst)
print("saved", dst)
