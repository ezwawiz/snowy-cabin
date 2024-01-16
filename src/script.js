import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('white', 1, 20)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
bricksColorTexture.colorSpace = THREE.SRGBColorSpace

const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const snowAmbientOcclusionTexture = textureLoader.load('/textures/snow/snow_02_ao_1k.jpg')
const snowMetalnessTexture = textureLoader.load('/textures/snow/snow_02_arm_1k.jpg')
const snowHeightTexture = textureLoader.load('/textures/snow/snow_02_disp_1k.jpg')
const snowNormalTexture = textureLoader.load('/textures/snow/snow_02_nor_gl_1k.jpg')
const snowRoughnessTexture = textureLoader.load('/textures/snow/snow_02_rough_1k.jpg')
const snowAlphaTexture = textureLoader.load('/textures/snow/snow_02_translucent_1k.jpg')

/**
 * House
 */

// Group
const cabin = new THREE.Group()
scene.add(cabin)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.position.y = 1.25
cabin.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 2, 4),
    new THREE.MeshStandardMaterial({ color: 'brown' })

)
roof.position.y = 3.5
roof.rotation.y = Math.PI / 4
cabin.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y = 0.9
door.position.z = 2.01
cabin.add(door)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        aoMap: snowAmbientOcclusionTexture,
        normalMap: snowNormalTexture,
        metalnessMap: snowMetalnessTexture,
        roughnessMap: snowRoughnessTexture,

    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Tree 
const forest = new THREE.Group()
scene.add(forest)

const treeTop = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 2, 32),
    new THREE.MeshStandardMaterial({ color: '#01796f' })
)

const treeTrunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32),
    new THREE.MeshStandardMaterial({ color: '#993300' })
)
treeTrunk.position.y = -1.2

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const tree = new THREE.Group()
    tree.add(treeTop.clone(), treeTrunk.clone())


    tree.position.set(x, 1.4, z)
    // tree.rotation.y = (Math.random() - 0.5) * 0.4
    // tree.rotation.z = (Math.random() - 0.5) * 0.4
    // tree.castShadow = true
    forest.add(tree)
}

/* Particles */

const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)

const count = 50000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    color: 'white',
    // blending: THREE.AdditiveBlending, // any particles on the same pixel will be added on top; color looks brighter(like glowing)
    // vertexColors: true

})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 1.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('gold', 12, 7)
doorLight.position.set(0, 2.2, 2.8)
cabin.add(doorLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#e6f0fc')

/* Shadows */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

walls.castShadow = true
treeTop.castShadow = true

floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    particles.rotation.x = elapsedTime
    particles.rotation.z = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()