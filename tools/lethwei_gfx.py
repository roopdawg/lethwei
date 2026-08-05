"""
LETHWEI(TM) procedural graphics.
Run headless:
  blender --background --python lethwei_gfx.py -- --variant emblem --out /path/out.png

Visual language, locked to the site's design tokens:
  bg      #0A0A0A  (film is transparent; renders composite onto this)
  red     #C41E1E  key / rim
  gold    #D4A017  counter-rim
  text    #F5F0E8  specular pop
Forms are angular and faceted. Nothing anatomical.
"""
import bpy, math, sys, os, random
from mathutils import Vector, Euler

# ---------------------------------------------------------------- args
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def arg(name, default=None):
    if name in argv:
        return argv[argv.index(name) + 1]
    return default


VARIANT = arg("--variant", "emblem")
OUT = arg("--out", "/tmp/lethwei.png")
RES_X = int(arg("--rx", 1400))
RES_Y = int(arg("--ry", 1750))
SAMPLES = int(arg("--samples", 96))
SEED = int(arg("--seed", 9))

RED = (0.769, 0.118, 0.118)      # C41E1E
GOLD = (0.831, 0.627, 0.090)     # D4A017
BONE = (0.961, 0.941, 0.909)     # F5F0E8

# Lights are tinted toward white. Saturated brand-coloured light on
# brand-coloured metal double-saturates and clips to pure yellow/pink —
# the material carries the colour, the light only shapes it.
RED_L = (0.98, 0.46, 0.40)
GOLD_L = (1.00, 0.86, 0.56)


# ---------------------------------------------------------------- scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        sc.cycles.device = "GPU"
    except Exception as e:
        print("GPU setup skipped:", e)
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    sc.render.resolution_x = RES_X
    sc.render.resolution_y = RES_Y
    sc.render.film_transparent = True          # composite onto #0A0A0A
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    # Standard keeps the brand hexes true; Filmic/AgX desaturates the red+gold
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"


def mat_metal(name, base, rough=0.34, metallic=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*base, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    return m


def mat_emit(name, color, strength=6.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs["Emission"], o.inputs["Surface"])
    return m


# ---------------------------------------------------------------- forms
def blade(idx, total, radius=1.05, length=2.15, seed=0):
    """One angular spike radiating outward in the XZ plane, facing camera."""
    rnd = random.Random(seed * 100 + idx)
    ang = (idx / total) * math.tau + math.pi / 2  # start at 12 o'clock
    L = length * rnd.uniform(0.90, 1.10)
    bpy.ops.mesh.primitive_cone_add(
        vertices=4, radius1=0.19 + rnd.uniform(-0.02, 0.03), radius2=0.0, depth=L
    )
    ob = bpy.context.object
    # cone points +Z by default; lay it into the XZ plane pointing outward
    ob.rotation_euler = Euler((0, 0, 0), "XYZ")
    d = radius + L / 2
    ob.location = (math.cos(ang) * d, 0, math.sin(ang) * d)
    ob.rotation_euler = Euler((math.pi / 2, 0, 0), "XYZ")
    ob.rotation_euler.rotate(Euler((0, -(ang - math.pi / 2), 0), "XYZ"))
    ob.rotation_euler = Euler((0, math.pi / 2 - ang, 0), "XYZ")
    bpy.ops.object.shade_flat()
    return ob


def core(r=0.86):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r)
    ob = bpy.context.object
    ob.rotation_euler = Euler((0.34, 0.2, 0), "XYZ")
    bpy.ops.object.shade_flat()
    return ob


def ring(r=3.62, thick=0.030):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=r, minor_radius=thick, major_segments=72, minor_segments=4,
        rotation=(math.pi / 2, 0, 0),
    )
    ob = bpy.context.object
    bpy.ops.object.shade_flat()
    return ob


# ---------------------------------------------------------------- lights
def three_point(scale=1.0, key=RED_L, rim=GOLD_L, energy_mul=1.0):
    def area(name, loc, rot, color, energy, size):
        d = bpy.data.lights.new(name, "AREA")
        d.color = color
        d.energy = energy
        d.size = size
        o = bpy.data.objects.new(name, d)
        o.location = loc
        o.rotation_euler = Euler(rot, "XYZ")
        bpy.context.collection.objects.link(o)
        return o

    s = scale

    def aim(o, target=(0, 0, 0)):
        d = Vector(target) - Vector(o.location)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

    e = energy_mul
    k = area("key",  (-6.0 * s, -5.0 * s,  4.6 * s), (0, 0, 0), key, 1150 * s * s * e, 7 * s)
    r = area("rim",  ( 6.4 * s, -2.0 * s,  3.4 * s), (0, 0, 0), rim,  760 * s * s * e, 6 * s)
    f = area("fill", (-1.2 * s, -8.0 * s, -3.0 * s), (0, 0, 0), BONE, 420 * s * s * e, 11 * s)
    for o in (k, r, f):
        aim(o)


def camera(loc, look_at=(0, 0, 0), lens=68, ortho=None):
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    cam = bpy.data.objects.new("cam", cd)
    cam.location = loc
    bpy.context.collection.objects.link(cam)
    direction = Vector(look_at) - Vector(loc)
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = cam
    return cam


# ---------------------------------------------------------------- builds
def build_emblem(n=9, dim=1.0):
    """9 spikes + faceted core + thin ring. Radially symmetric, reads as a mark.

    `dim` scales material brightness for the ghosted backdrop variants, which
    sit behind 8xl type and must never compete with it.
    """
    def d(c):
        return tuple(x * dim for x in c)

    dark = mat_metal("dark", d((0.22, 0.22, 0.235)), rough=0.36)
    coremat = mat_metal("core", d((0.30, 0.30, 0.315)), rough=0.24)
    goldmat = mat_metal("gold", d(GOLD), rough=0.34, metallic=0.85)
    redmat = mat_metal("red", d(RED), rough=0.34, metallic=0.85)

    # every 3rd spike gold, one red at 12 o'clock (the 9th limb — the headbutt)
    for i in range(n):
        b = blade(i, n, seed=SEED)
        if i == 0:
            b.data.materials.append(redmat)
        elif i % 3 == 0:
            b.data.materials.append(goldmat)
        else:
            b.data.materials.append(dark)

    core().data.materials.append(coremat)
    ring().data.materials.append(goldmat)


def build_shards(seed, n=14, dim=1.0):
    """Loose angular debris field — for backdrops and section art.

    `dim` scales the material brightness down: hero backdrops sit behind
    8xl type and must never compete with it.
    """
    dark = mat_metal("dark", tuple(c * dim for c in (0.20, 0.20, 0.215)), rough=0.40)
    goldmat = mat_metal("gold", tuple(c * dim for c in GOLD), rough=0.38, metallic=0.85)
    redmat = mat_metal("red", tuple(c * dim for c in RED), rough=0.38, metallic=0.85)
    rnd = random.Random(seed)
    for i in range(n):
        bpy.ops.mesh.primitive_cone_add(
            vertices=4,
            radius1=rnd.uniform(0.16, 0.52),
            radius2=0.0,
            depth=rnd.uniform(1.6, 4.4),
        )
        ob = bpy.context.object
        ob.location = (rnd.uniform(-4.4, 4.4), rnd.uniform(-2.6, 3.4), rnd.uniform(-3.2, 3.2))
        ob.rotation_euler = Euler(
            (rnd.uniform(0, math.tau), rnd.uniform(0, math.tau), rnd.uniform(0, math.tau)), "XYZ"
        )
        bpy.ops.object.shade_flat()
        roll = rnd.random()
        ob.data.materials.append(redmat if roll > 0.88 else (goldmat if roll > 0.70 else dark))


# ---------------------------------------------------------------- main
def main():
    reset()
    if VARIANT == "emblem":
        build_emblem()
        three_point()
        camera((0, -14.2, 0.5), (0, 0, 0), lens=62)
    elif VARIANT == "ghost":
        # Dim, cropped emblem. Same mark, pushed back so type stays dominant.
        build_emblem(dim=0.16)
        three_point(scale=1.0, energy_mul=0.30)
        rnd = random.Random(SEED)
        # Spin the whole mark in the image plane, about the WORLD origin —
        # rotating each object's own euler would scatter the radial layout.
        from mathutils import Matrix
        R = Matrix.Rotation(rnd.uniform(0, math.tau), 4, "Y")
        for ob in list(bpy.context.scene.objects):
            if ob.type == "MESH":
                ob.matrix_world = R @ ob.matrix_world
        # close in so the mark crops off-frame rather than sitting as a logo
        camera((rnd.uniform(-1.1, 1.1), -7.6, rnd.uniform(-0.9, 0.9)), (0, 0, 0), lens=62)
    elif VARIANT == "backdrop":
        build_shards(SEED, n=16, dim=0.55)
        three_point(scale=1.15)
        camera((0, -12.5, 1.4), (0, 0, 0), lens=52)
    elif VARIANT == "section":
        build_shards(SEED, n=7, dim=1.0)
        three_point(scale=0.9)
        camera((0, -10.0, 0.8), (0, 0, 0), lens=60)
    else:
        raise SystemExit("unknown variant: " + VARIANT)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.context.scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("WROTE", OUT)


main()
