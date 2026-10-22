import numpy as np
from PIL import Image

src = "diablito_raw.png"
dst = "diablito_clean.png"

img = Image.open(src).convert("RGBA")
arr = np.array(img).astype(np.float64)
r, g, b, al = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]

# 1) ghost = watermark over transparent bg (clean, precise)
ghost = ((al >= 8) & (al <= 60) & (r > 180) & (g > 180) & (b > 180)).astype(np.float64)

H, W = r.shape
cy, cx = H // 2, W // 2

# 2) FFT of ghost -> exact watermark frequencies
Fg = np.fft.fftshift(np.fft.fft2(ghost))
mag = np.abs(Fg)
# exclude DC / very low freq (devil content is not in ghost mask anyway, but keep DC clean)
mag[cy - 2:cy + 2, cx - 2:cx + 2] = 0

# find peaks: threshold relative to max (watermark is periodic -> sharp strong peaks)
thr = mag.max() * 0.02
peaks = mag > thr
print("watermark freq bins:", peaks.sum())

# 3) notch these frequencies in R, G, B (set to zero + 1px ring)
notch = np.zeros_like(peaks)
notch[peaks] = True
for dy in (-1, 0, 1):
    for dx in (-1, 0, 1):
        notch |= np.roll(np.roll(peaks, dy, 0), dx, 1)


def notch_channel(ch):
    F = np.fft.fftshift(np.fft.fft2(ch))
    F[notch] = 0
    return np.fft.ifft2(np.fft.ifftshift(F)).real


r2 = notch_channel(r)
g2 = notch_channel(g)
b2 = notch_channel(b)

# 4) remove ghost alpha
ghost_bool = ghost > 0
al[ghost_bool] = 0

out = np.stack([r2, g2, b2, al], axis=-1)
out = np.clip(out, 0, 255).astype(np.uint8)
Image.fromarray(out, "RGBA").save(dst)
print("saved", dst)
