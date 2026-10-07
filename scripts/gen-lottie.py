#!/usr/bin/env python3
"""Generates the brand line-art Lottie icons into public/animations/.
Run: python3 scripts/gen-lottie.py   (gold #C9A55A strokes on a transparent 100x100 canvas)"""
import json, math, os

GOLD = [0.788, 0.647, 0.353, 1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "animations")


def val(v):
    return {"a": 0, "k": v}


def anim(keys, ease=(0.25, 0.75)):
    """keys: [(frame, value)] -> animated property with eased keyframes."""
    out = []
    for i, (t, v) in enumerate(keys):
        v = v if isinstance(v, list) else [v]
        k = {"t": t, "s": v}
        if i < len(keys) - 1:
            n = len(v)
            k["i"] = {"x": [1 - ease[0]] * n, "y": [1] * n}
            k["o"] = {"x": [ease[1] * 0 + 0.25] * n, "y": [0] * n}
        out.append(k)
    return {"a": 1, "k": out}


def tr():
    return {"ty": "tr", "p": val([0, 0]), "a": val([0, 0]), "s": val([100, 100]),
            "r": val(0), "o": val(100), "sk": val(0), "sa": val(0), "nm": "Transform"}


def stroke(w=3, o=100):
    return {"ty": "st", "c": val(GOLD), "o": val(o), "w": val(w), "lc": 2, "lj": 2, "ml": 4, "nm": "Stroke"}


def grp(items, name="g"):
    return {"ty": "gr", "it": items + [tr()], "nm": name}


def ellipse(cx, cy, w, h=None):
    return {"ty": "el", "p": val([cx, cy]) if not isinstance(cx, dict) else cx, "s": val([w, h if h is not None else w]) if not isinstance(w, dict) else w, "d": 1, "nm": "Ellipse"}


def rect(cx, cy, w, h, r=0):
    return {"ty": "rc", "p": val([cx, cy]), "s": val([w, h]), "r": val(r), "d": 1, "nm": "Rect"}


def path(points, closed=False):
    z = [[0, 0]] * len(points)
    return {"ty": "sh", "ks": val({"i": z, "o": z, "v": points, "c": closed}), "nm": "Path"}


def trim(end):
    return {"ty": "tm", "s": val(0), "e": end, "o": val(0), "m": 1, "nm": "Trim"}


def layer(idx, name, shapes, op, o=None, r=None, p=None, s=None, a=None):
    return {"ddd": 0, "ind": idx, "ty": 4, "nm": name, "sr": 1,
            "ks": {"o": o or val(100), "r": r or val(0), "p": p or val([50, 50, 0]),
                   "a": a or val([50, 50, 0]), "s": s or val([100, 100, 100])},
            "ao": 0, "shapes": shapes, "ip": 0, "op": op, "st": 0, "bm": 0}


def lottie(name, op, layers):
    for i, l in enumerate(layers):
        l["ind"] = i + 1
    return {"v": "5.7.4", "fr": 30, "ip": 0, "op": op, "w": 100, "h": 100, "nm": name,
            "ddd": 0, "assets": [], "layers": layers}


def star(cx, cy, ro, ri, n=5):
    pts = []
    for i in range(n * 2):
        ang = -math.pi / 2 + i * math.pi / n
        r = ro if i % 2 == 0 else ri
        pts.append([round(cx + r * math.cos(ang), 2), round(cy + r * math.sin(ang), 2)])
    return pts


icons = {}

# 1. passport-stamp: lands with a scale bounce, rests at the final frame
icons["passport-stamp"] = lottie("passport-stamp", 46, [
    layer(1, "stamp",
          [grp([ellipse(50, 50, 80), stroke(3.5)]),
           grp([ellipse(50, 50, 64), stroke(1.5)]),
           grp([path(star(50, 50, 17, 7.5), True), stroke(2.5)])],
          46,
          o=anim([(0, 0), (5, 100)]),
          r=anim([(0, -22), (14, -9)]),
          s=anim([(0, [175, 175, 100]), (9, [88, 88, 100]), (14, [106, 106, 100]), (19, [100, 100, 100])])),
])

# 2. passport-ticket: static passport booklet
icons["passport-ticket"] = lottie("passport-ticket", 30, [
    layer(1, "passport",
          [grp([rect(50, 50, 46, 72, 5), stroke(3)]),
           grp([ellipse(50, 40, 22), stroke(2.5)]),
           grp([ellipse(50, 40, 10, 22), stroke(2)]),
           grp([path([[39, 40], [61, 40]]), stroke(2)]),
           grp([path([[37, 66], [63, 66]]), stroke(2.5)]),
           grp([path([[42, 74], [58, 74]]), stroke(2.5)])],
          30),
])

# 3. plane: paper plane drifting up-right and settling back (loops, also used for scroll scrub)
icons["plane"] = lottie("plane", 60, [
    layer(1, "plane",
          [grp([path([[88, 14], [12, 42], [38, 55], [50, 84]], True), stroke(3)]),
           grp([path([[38, 55], [88, 14]]), stroke(2)])],
          60,
          p=anim([(0, [44, 56, 0]), (30, [56, 44, 0]), (60, [44, 56, 0])]),
          r=anim([(0, -4), (30, 4), (60, -4)])),
])

# 4. globe: two meridians sweeping to imitate rotation (seamless loop)
chord = round(math.sqrt(36 ** 2 - 16 ** 2), 2)
icons["globe"] = lottie("globe", 90, [
    layer(1, "sphere",
          [grp([ellipse(50, 50, 72), stroke(3)]),
           grp([path([[14, 50], [86, 50]]), stroke(2)]),
           grp([path([[50 - chord, 34], [50 + chord, 34]]), stroke(1.5)]),
           grp([path([[50 - chord, 66], [50 + chord, 66]]), stroke(1.5)])],
          90),
    layer(2, "meridian-a",
          [grp([ellipse(50, 50, 72, 72), stroke(2)])],
          90),
    layer(3, "meridian-b",
          [grp([ellipse(50, 50, 72, 72), stroke(2)])],
          90),
])
# animate meridian widths (ellipse size) directly on the shapes
icons["globe"]["layers"][1]["shapes"][0]["it"][0]["s"] = anim([(0, [72, 72]), (45, [0, 72]), (90, [72, 72])], (0.45, 0.55))
icons["globe"]["layers"][2]["shapes"][0]["it"][0]["s"] = anim([(0, [0, 72]), (45, [72, 72]), (90, [0, 72])], (0.45, 0.55))

# 5. map-pin: bounces once
icons["map-pin"] = lottie("map-pin", 36, [
    layer(1, "pin",
          [grp([ellipse(50, 38, 42), stroke(3)]),
           grp([path([[32, 49], [50, 84], [68, 49]]), stroke(3)]),
           grp([ellipse(50, 38, 14), stroke(2.5)])],
          36,
          p=anim([(0, [50, 50, 0]), (8, [50, 38, 0]), (16, [50, 50, 0]), (22, [50, 45, 0]), (28, [50, 50, 0])])),
    layer(2, "shadow",
          [grp([ellipse(50, 90, 26, 6), stroke(2, 60)])],
          36,
          s=anim([(0, [100, 100, 100]), (8, [60, 100, 100]), (16, [100, 100, 100])])),
])

# 6. document-check: the tick draws itself
icons["document-check"] = lottie("document-check", 50, [
    layer(1, "doc",
          [grp([path([[28, 14], [58, 14], [72, 28], [72, 86], [28, 86]], True), stroke(3)]),
           grp([path([[58, 14], [58, 28], [72, 28]]), stroke(2.5)])],
          50),
    layer(2, "check",
          [grp([path([[38, 56], [48, 66], [64, 46]]), trim(anim([(0, 0), (8, 0), (22, 100)])), stroke(3.5)])],
          50),
])

# 7. building: windows pop in one after another
wins = []
for i, (x, y) in enumerate([(42, 38), (58, 38), (42, 52), (58, 52), (42, 66), (58, 66)]):
    t = 4 + i * 3
    wins.append(layer(0, f"win{i}", [grp([rect(x, y, 8, 8, 1), stroke(2.5)])], 40,
                      a=val([x, y, 0]), p=val([x, y, 0]),
                      s=anim([(0, [0, 0, 100]), (t, [0, 0, 100]), (t + 6, [125, 125, 100]), (t + 10, [100, 100, 100])])))
icons["building"] = lottie("building", 40, [
    layer(0, "body",
          [grp([rect(50, 55, 44, 64, 3), stroke(3)]),
           grp([path([[44, 87], [44, 78], [56, 78], [56, 87]]), stroke(2.5)])],
          40),
] + wins)

os.makedirs(OUT, exist_ok=True)
for name, data in icons.items():
    p = os.path.join(OUT, f"{name}.json")
    with open(p, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print(f"{name}.json  {os.path.getsize(p)} bytes")
