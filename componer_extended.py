# Compone las imagenes finales del Extended Art: arte del PDF + carta original pegada en el centro.
# Resultado: public/proxys/ExtendedArt/final/<id>.webp (producto) y final/t/<id>.webp (miniatura)
import os, sys, re, json, subprocess, urllib.request
from concurrent.futures import ThreadPoolExecutor

def pip(*pk):
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", *pk])
try:
    from PIL import Image, ImageDraw
except ImportError:
    pip("pillow"); from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.abspath(__file__))
EA = os.path.join(ROOT, "public", "proxys", "ExtendedArt")
PV, CARTAS = os.path.join(EA, "pv"), os.path.join(EA, "cartas")
FINAL, THUMB = os.path.join(EA, "final"), os.path.join(EA, "final", "t")
CACHE = os.path.join(ROOT, "_cache_cartas")
for d in (FINAL, THUMB, CACHE): os.makedirs(d, exist_ok=True)
W = 720            # ancho de la imagen final (el arte original mide 560)
TW = 180           # ancho de la miniatura

src = open(os.path.join(ROOT, "data", "extendedArt.js"), encoding="utf-8").read()
def arr(name):
    m = re.search(r"export const %s = (\[.*?\]);\n" % name, src, re.S)
    return json.loads(m.group(1))
singles, evos = arr("extendedSingles"), arr("extendedEvolutions")

jobs = []   # (slug, [(rect, card_id|None)])
for s in singles: jobs.append((s["id"][3:], [(s["center"], s.get("card"))]))
for e in evos:    jobs.append((e["id"][3:], list(zip(e["centers"], e["cards"]))))

def get_card(cid, slug):
    local = os.path.join(CARTAS, slug + ".jpg")
    if cid:
        f = os.path.join(CACHE, "%s.jpg" % cid)
        if not os.path.exists(f):
            req = urllib.request.Request("https://product-images.tcgplayer.com/fit-in/437x610/%s.jpg" % cid,
                                         headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urllib.request.urlopen(req, timeout=30) as r, open(f, "wb") as o: o.write(r.read())
            except Exception as ex:
                print("  no se pudo bajar", cid, ex); f = None
        if f and os.path.exists(f): return f
    return local if os.path.exists(local) else None

def cover(im, w, h):
    r = max(w / im.width, h / im.height)
    im = im.resize((max(w, round(im.width * r)), max(h, round(im.height * r))), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))

def one(job):
    slug, cells = job
    base_f = os.path.join(PV, slug + ".webp")
    if not os.path.exists(base_f): return slug, "sin arte base"
    base = Image.open(base_f).convert("RGB")
    base = base.resize((W, round(base.height * W / base.width)), Image.LANCZOS)
    falta = []
    for rect, cid in cells:
        f = get_card(cid, slug)
        x, y = round(rect["left"] / 100 * base.width), round(rect["top"] / 100 * base.height)
        w, h = round(rect["w"] / 100 * base.width), round(rect["h"] / 100 * base.height)
        ImageDraw.Draw(base).rectangle([x, y, x + w, y + h], fill=(20, 8, 10))
        if not f: falta.append(cid or slug); continue
        card = cover(Image.open(f).convert("RGB"), w, h)
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=round(w * 0.045), fill=255)
        base.paste(card, (x, y), mask)
    base.save(os.path.join(FINAL, slug + ".webp"), quality=82, method=6)
    t = base.resize((TW, round(base.height * TW / base.width)), Image.LANCZOS)
    t.save(os.path.join(THUMB, slug + ".webp"), quality=82, method=6)
    return slug, ("falta carta: %s" % falta if falta else "ok")

if __name__ == "__main__":
    print("Componiendo %d imagenes..." % len(jobs))
    bad = 0
    with ThreadPoolExecutor(6) as ex:
        for i, (slug, st) in enumerate(ex.map(one, jobs), 1):
            if st != "ok": bad += 1; print("  [%d/%d] %s -> %s" % (i, len(jobs), slug, st))
    print("Listo: %d ok, %d con problemas. Imagenes en %s" % (len(jobs) - bad, bad, FINAL))
