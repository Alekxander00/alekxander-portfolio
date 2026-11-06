// Lee un archivo .bbmodel de Blockbench (formato libre, mallas) y lo convierte
// en objetos de three.js, con sus animaciones. Así la web usa el modelo original
// de la Máquina sin exportarlo a glTF.
import * as THREE from 'three'

const rad = THREE.MathUtils.degToRad

function cargarTextura(fuente) {
  return new Promise((resolver, fallar) => {
    new THREE.TextureLoader().load(
      fuente,
      (tex) => {
        // Pixel art: sin suavizado.
        tex.magFilter = THREE.NearestFilter
        tex.minFilter = THREE.NearestFilter
        tex.generateMipmaps = false
        tex.colorSpace = THREE.SRGBColorSpace
        resolver(tex)
      },
      undefined,
      fallar,
    )
  })
}

// Ordena los vértices de una cara alrededor de su centro, para triangular un
// cuadrilátero sin cruzarlo (Blockbench no garantiza el orden).
function ordenarCara(puntos) {
  if (puntos.length < 4) return puntos.map((_, i) => i)
  const c = new THREE.Vector3()
  puntos.forEach((p) => c.add(p))
  c.multiplyScalar(1 / puntos.length)
  const n = new THREE.Vector3()
    .subVectors(puntos[1], puntos[0])
    .cross(new THREE.Vector3().subVectors(puntos[2], puntos[0]))
  if (n.lengthSq() < 1e-10) {
    n.subVectors(puntos[2], puntos[0]).cross(new THREE.Vector3().subVectors(puntos[3], puntos[0]))
  }
  n.normalize()
  const u = new THREE.Vector3().subVectors(puntos[0], c).normalize()
  const v = new THREE.Vector3().crossVectors(n, u)
  return puntos
    .map((p, i) => {
      const d = new THREE.Vector3().subVectors(p, c)
      return { i, a: Math.atan2(d.dot(v), d.dot(u)) }
    })
    .sort((x, y) => x.a - y.a)
    .map((x) => x.i)
}

function mallaDeElemento(el, texturas, materiales) {
  const porTextura = new Map()
  for (const cara of Object.values(el.faces)) {
    if (cara.texture == null || cara.texture === false) continue
    const tIdx = typeof cara.texture === 'number' ? cara.texture : texturas.findIndex((t) => t.uuid === cara.texture)
    if (tIdx < 0) continue
    const tex = texturas[tIdx]
    const ancho = tex.uv_width || tex.width || 16
    const alto = tex.uv_height || tex.height || 16
    const claves = cara.vertices
    const puntos = claves.map((k) => new THREE.Vector3(...el.vertices[k]))
    const orden = ordenarCara(puntos)
    const tris = orden.length === 4 ? [orden[0], orden[1], orden[2], orden[0], orden[2], orden[3]] : orden
    if (!porTextura.has(tIdx)) porTextura.set(tIdx, { pos: [], uv: [] })
    const buf = porTextura.get(tIdx)
    for (const i of tris) {
      const p = puntos[i]
      const [u, w] = cara.uv[claves[i]] || [0, 0]
      buf.pos.push(p.x, p.y, p.z)
      buf.uv.push(u / ancho, 1 - w / alto)
    }
  }

  const pos = []
  const uv = []
  const geo = new THREE.BufferGeometry()
  const mats = []
  let inicio = 0
  for (const [tIdx, buf] of porTextura) {
    pos.push(...buf.pos)
    uv.push(...buf.uv)
    const cuenta = buf.pos.length / 3
    geo.addGroup(inicio, cuenta, mats.length)
    mats.push(materiales[tIdx])
    inicio += cuenta
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.computeVertexNormals()
  const malla = new THREE.Mesh(geo, mats)
  malla.name = el.name
  return malla
}

export async function cargarBbmodel(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`No se pudo leer ${url}`)
  const datos = await r.json()

  const texturasImg = await Promise.all(datos.textures.map((t) => cargarTextura(t.source)))
  const materiales = texturasImg.map(
    (map) =>
      new THREE.MeshStandardMaterial({
        map,
        transparent: true,
        alphaTest: 0.1,
        side: THREE.DoubleSide,
        roughness: 0.85,
        metalness: 0.05,
      }),
  )

  const grupos = new Map((datos.groups || []).map((g) => [g.uuid, g]))
  const elementos = new Map(datos.elements.map((e) => [e.uuid, e]))
  const huesos = new Map()
  const raiz = new THREE.Group()

  const construir = (nodo, padre, origenPadre) => {
    if (typeof nodo === 'string') {
      const el = elementos.get(nodo)
      if (!el || el.visibility === false || el.export === false || el.type !== 'mesh') return
      const malla = mallaDeElemento(el, datos.textures, materiales)
      const o = el.origin || [0, 0, 0]
      malla.position.set(o[0] - origenPadre[0], o[1] - origenPadre[1], o[2] - origenPadre[2])
      const rot = el.rotation || [0, 0, 0]
      malla.rotation.set(rad(rot[0]), rad(rot[1]), rad(rot[2]), 'ZYX')
      padre.add(malla)
      return
    }
    const g = grupos.get(nodo.uuid)
    if (!g) return
    const hueso = new THREE.Group()
    hueso.name = g.name
    const o = g.origin || [0, 0, 0]
    hueso.position.set(o[0] - origenPadre[0], o[1] - origenPadre[1], o[2] - origenPadre[2])
    const rot = g.rotation || [0, 0, 0]
    hueso.rotation.set(rad(rot[0]), rad(rot[1]), rad(rot[2]), 'ZYX')
    hueso.userData.base = { pos: hueso.position.clone(), rot: hueso.rotation.clone() }
    padre.add(hueso)
    huesos.set(g.uuid, hueso)
    ;(nodo.children || []).forEach((c) => construir(c, hueso, o))
  }
  datos.outliner.forEach((n) => construir(n, raiz, [0, 0, 0]))

  // materiales: uno por textura del archivo, en su orden (aunque la malla no los use todos).
  return { raiz, animaciones: prepararAnimaciones(datos.animations || [], huesos), huesos, materiales }
}

function prepararAnimaciones(lista, huesos) {
  const anims = {}
  for (const a of lista) {
    const canales = []
    let fin = 0
    for (const [uuid, animador] of Object.entries(a.animators || {})) {
      const hueso = huesos.get(uuid)
      if (!hueso || !animador.keyframes?.length) continue
      const porCanal = {}
      for (const k of animador.keyframes) {
        const dp = k.data_points[0]
        const valor = ['x', 'y', 'z'].map((ax) => Number(dp[ax]) || 0)
        ;(porCanal[k.channel] ||= []).push({ t: k.time, v: valor, interp: k.interpolation })
        fin = Math.max(fin, k.time)
      }
      for (const [canal, kfs] of Object.entries(porCanal)) {
        kfs.sort((x, y) => x.t - y.t)
        canales.push({ hueso, canal, kfs })
      }
    }
    anims[a.name] = { duracion: a.length || fin, fin: fin || a.length, canales }
  }
  return anims
}

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}

function muestrear(kfs, t) {
  if (t <= kfs[0].t) return kfs[0].v
  const n = kfs.length
  if (t >= kfs[n - 1].t) return kfs[n - 1].v
  let i = 0
  while (i < n - 1 && kfs[i + 1].t < t) i++
  const a = kfs[i]
  const b = kfs[i + 1]
  const alfa = (t - a.t) / (b.t - a.t || 1)
  if (a.interp === 'step') return a.v
  if (a.interp === 'catmullrom' || b.interp === 'catmullrom') {
    const p0 = (kfs[i - 1] || a).v
    const p3 = (kfs[i + 2] || b).v
    return [0, 1, 2].map((ax) => catmull(p0[ax], a.v[ax], b.v[ax], p3[ax], alfa))
  }
  return [0, 1, 2].map((ax) => a.v[ax] + (b.v[ax] - a.v[ax]) * alfa)
}

// Pone los huesos en su pose de reposo y aplica la animación en el tiempo t.
// Convenciones de Blockbench: X e Y de rotación invertidos; posición X invertida.
export function posar(huesos, anim, t) {
  for (const h of huesos.values()) {
    h.position.copy(h.userData.base.pos)
    h.rotation.copy(h.userData.base.rot)
    h.scale.set(1, 1, 1)
  }
  if (!anim) return
  for (const { hueso, canal, kfs } of anim.canales) {
    const v = muestrear(kfs, t)
    if (canal === 'rotation') {
      hueso.rotation.x -= rad(v[0])
      hueso.rotation.y -= rad(v[1])
      hueso.rotation.z += rad(v[2])
    } else if (canal === 'position') {
      hueso.position.x -= v[0]
      hueso.position.y += v[1]
      hueso.position.z += v[2]
    } else if (canal === 'scale') {
      hueso.scale.set(v[0], v[1], v[2])
    }
  }
}
