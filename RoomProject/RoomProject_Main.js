//#region Libs

//ThreeJs
import * as THREE from '../Libs/ThreeJs/builds/three.module.js';

//Loader
import { FBXLoader } from '../Libs/ThreeJs/jsm/loaders/FBXLoader.js';  
import {GLTFLoader} from '../Libs/ThreeJs/jsm/loaders/GLTFLoader.js'    

// Composer
import { EffectComposer } from '../Libs/ThreeJs/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from '../Libs/ThreeJs/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from '../Libs/ThreeJs/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from '../Libs/ThreeJs/jsm/postprocessing/RenderPass.js';
import * as dat from '../Libs/ThreeJs/jsm/libs/dat.gui.module.js';

//Light
import { RectAreaLightHelper } from '../Libs/ThreeJs/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '../Libs/ThreeJs/jsm/lights/RectAreaLightUniformsLib.js';

//Bloom
import { UnrealBloomPass } from '../Libs/ThreeJs/jsm/postprocessing/UnrealBloomPass.js';
import { SAOPass } from '../Libs/ThreeJs/jsm/postprocessing/SAOPass.js';

import { ShadowMesh } from '../Libs/ThreeJs/jsm/objects/ShadowMesh.js';
//Hdri
import { RGBELoader } from '../Libs/ThreeJs/jsm/loaders/RGBELoader.js';

//Shader
import { FXAAShader } from '../Libs/ThreeJs/jsm/shaders/FXAAShader.js';

//Control
import { IndoorControls } from '../Libs/ThreeJs/jsm/controls/IndoorControls.js';
import { OrbitControls } from '../Libs/ThreeJs/jsm/controls/OrbitControls.js';

//#endregion


//#region  main func

//Setup SCene
var container = document.getElementById( 'container' );
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x808080 );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000000 );
camera.position.set( 0, 0, 0 );
var frustumSize = 20;
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0);


renderer.gammaOutput = true
renderer.gammaFactor = 2.2    

//shadow
renderer.shadowMap.enabled = true;
// renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap	

//Tone
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

//Create Control
var controls = new IndoorControls( camera, renderer.domElement, scene ) ;

// var controls = new OrbitControls( camera, renderer.domElement, scene ) ;

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

//Global variable
//Select by mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedObjects = [];
var composer, effectFXAA, outlinePass, saoPass, bloomPass;
var material_select_container  = document.getElementById( 'material_container' );
var envMap;


//#region Material
//Texture Loader
var tex_loader = new THREE.TextureLoader();

//Test Material
var textureLoader = new THREE.TextureLoader();
var normalMap2 = textureLoader.load( "../Libs/ThreeJs/textures/water/Water_1_M_Normal.jpg" );
var clearcoatNormaMap = textureLoader.load( "../Libs/ThreeJs/textures/pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png" );
var geometry = new THREE.SphereBufferGeometry( 30, 32, 32 );
var material = new THREE.MeshPhysicalMaterial( {
	clearcoat: 1.0,
	metalness: 0.2,
	// color: 0xff0000,
	normalMap: normalMap2,
	normalScale: new THREE.Vector2( 0.15, 0.15 ),
	clearcoatNormalMap: clearcoatNormaMap,

	// y scale is negated to compensate for normal map handedness.
	clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
} );


//#region Floor Mat

//GlassMat
var glass_mat = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,
	roughness: 0.0,
	aoMapIntensity : 0.1,
	envMapIntensity: 0.1,
	transmission: 0.9, // use material.transmission for glass materials
	opacity: 1,			// set material.OPACITY to 1 when material.transmission is non-zero
	transparent: true,
} );

var light_mat = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,
	roughness: 0.4,

	emissive : 0xffffff,
	emissiveIntensity : 30,
} );


//Wall Material
//Map wall 1 D:\DEV\WebGL\ThreeJS\ThreeJsWithJsModule\ThreeJsWithJSModule\models\fbx\house\Texture\smooth-stucco-ue\smooth-stucco-albedo.png
var map_text_wall = tex_loader.load( '../models/fbx/house/texture/smooth-stucco-ue/smooth-stucco-albedo.png' );
map_text_wall.wrapS = THREE.RepeatWrapping;
map_text_wall.wrapT = THREE.RepeatWrapping;

var map_normal_wall = tex_loader.load('../models/fbx/house/texture/smooth-stucco-ue/smooth-stucco-Normal-dx.png');
map_normal_wall.wrapS = THREE.RepeatWrapping;
map_normal_wall.wrapT = THREE.RepeatWrapping;

var map_roughness_wall = tex_loader.load('../models/fbx/house/texture/smooth-stucco-ue/smooth-stucco-Roughness.png');
map_roughness_wall.wrapS = THREE.RepeatWrapping;
map_roughness_wall.wrapT = THREE.RepeatWrapping;

var map_displacementMap_wall = tex_loader.load('../models/fbx/house/texture/smooth-stucco-ue/smooth-stucco-Height.png');
map_displacementMap_wall.wrapS = THREE.RepeatWrapping;
map_displacementMap_wall.wrapT = THREE.RepeatWrapping;

var map_aoMap_wall = tex_loader.load('../models/fbx/house/texture/smooth-stucco-ue/smooth-stucco-ao.png');
map_aoMap_wall.wrapS = THREE.RepeatWrapping;
map_aoMap_wall.wrapT = THREE.RepeatWrapping;


var wall_mat = new THREE.MeshPhysicalMaterial( { 
	map: map_text_wall,
	normalMap: map_normal_wall,
	roughnessMap:map_roughness_wall,
	// displacementMap: map_displacementMap_wall ,
	aoMap:map_aoMap_wall,
	metalness: 0.0,
	normalScale: new THREE.Vector2( 0.1, 0.1 ),
	roughness : 0.45,
	aoMapIntensity : 0.1,
	envMapIntensity: 0.5,
	side: THREE.DoubleSide} );

//Roof Material
var roof_mat = new THREE.MeshPhysicalMaterial( {
	color: 0x40ffff,
	metalness: 0,
	roughness: 0.3,
	// alphaMap: texture,
	alphaTest: 0.5,
	envMap: envMap,
	envMapIntensity: 0.2,
	opacity: 1,  // set material.opacity to 1 when material.transmission is non-zero
	side: THREE.DoubleSide,
} );


var side_mat = new THREE.MeshPhysicalMaterial( {
	color: 0xffffff,
	metalness: 0,
	roughness: 0.1,
	// alphaMap: texture,
	alphaTest: 0.6,
	envMap: envMap,
	envMapIntensity: 0.3,
	opacity: 1,  // set material.opacity to 1 when material.transmission is non-zero
	side: THREE.DoubleSide,
} );

//Map floor 1 ThreeJsWithJSModule\models\fbx\house\narrow-floorboards1-albedo.png
var map_text_floor = tex_loader.load( '../models/fbx/house/texture/narrow-floorboards1-ue/Wood_Floor_007_COLOR.jpg' );
map_text_floor.wrapS = THREE.RepeatWrapping;
map_text_floor.wrapT = THREE.RepeatWrapping;

var map_normal_floor = tex_loader.load( '../models/fbx/house/texture/narrow-floorboards1-ue/Wood_Floor_007_NORM.jpg' );
map_normal_floor.wrapS = THREE.RepeatWrapping;
map_normal_floor.wrapT = THREE.RepeatWrapping;


var map_roughness_floor = tex_loader.load( '../models/fbx/house/texture/narrow-floorboards1-ue/Wood_Floor_007_ROUGH.jpg');
map_roughness_floor.wrapS = THREE.RepeatWrapping;
map_roughness_floor.wrapT = THREE.RepeatWrapping;


var map_displacementMap_floor = tex_loader.load( '../models/fbx/house/texture/narrow-floorboards1-ue/Wood_Floor_007_DISP.jpg');
map_displacementMap_floor.wrapS = THREE.RepeatWrapping;
map_displacementMap_floor.wrapT = THREE.RepeatWrapping;



var map_aoMap_floor = tex_loader.load( '../models/fbx/house/texture/narrow-floorboards1-ue/Wood_Floor_007_OCC.jpg');
map_aoMap_floor.wrapS = THREE.RepeatWrapping;
map_aoMap_floor.wrapT = THREE.RepeatWrapping;


var floor_mat = new THREE.MeshPhysicalMaterial( { 
	map: map_text_floor,

	// roughnessMap:map_roughness_floor,
	roughness : 1,

	aoMap:map_aoMap_floor,
	aoMapIntensity : 0.02, 
	envMapIntensity: 0.0,

	normalMap: map_normal_floor,
	normalScale : new THREE.Vector2(0.5, 0.5),
	clearcoatNormalScale: new THREE.Vector2( 2.0,  2.0 ),
	clearcoatNormalMap: map_normal_floor,

	clearcoat: 0.5,

	side: THREE.DoubleSide} );

//#endregion

//#region  Spot Material


//#endregion


//#region Chair Material

//Leather
var map_text_leather = tex_loader.load( '../models/fbx/Chair/textures/chair_leather_BaseColor.jpg' );
var map_normal_leather = tex_loader.load( '../models/fbx/Chair/textures/chair_leather_Normal.jpg' );
//metal
var map_text_metal = tex_loader.load( '../models/fbx/Chair/textures/chair_metal_BaseColor.jpg' );
var map_metalness_metal = tex_loader.load( '../models/fbx/Chair/textures/chair_metal_Roughness.jpg' );
var map_rounghness_metal = tex_loader.load( '../models/fbx/Chair/textures/chair_metal_Roughness.jpg' );
//Wood
var map_text_wood = tex_loader.load( '../models/fbx/Chair/textures/chair_wood_BaseColor.jpg' );
var map_normal_wood= tex_loader.load( '../models/fbx/Chair/textures/chair_wood_Normal.jpg' );
var map_rounghness_wood = tex_loader.load( '../models/fbx/Chair/textures/chair_wood_Roughness.jpg' );
//platic
var map_text_platic = tex_loader.load( '../models/fbx/Chair/textures/chair_plastic_BaseColor.jpg' );
var map_normal_platic = tex_loader.load( '../models/fbx/Chair/textures/chair_plastic_Normal.jpg' );
var map_rounghness_platic = tex_loader.load( '../models/fbx/Chair/textures/chair_plastic_Roughness.jpg' );

//Material
var leather_mat = new THREE.MeshPhysicalMaterial( { map: map_text_leather,  normalMap: map_normal_leather } );
var metal_mat = new THREE.MeshPhysicalMaterial( { map: map_text_metal,  metalnessMap:map_metalness_metal, roughnessMap:map_rounghness_metal } );
var wood_mat = new THREE.MeshPhysicalMaterial( { map: map_text_wood,  normalMap:map_normal_wood, roughnessMap:map_rounghness_wood } );
var platic_mat = new THREE.MeshPhysicalMaterial( {  map: map_text_platic,  normalMap:map_normal_platic, roughnessMap:map_rounghness_platic} );

//#endregion

//#endregion


//#region Spot Geo
var spot_mat = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.1} );
var spot_geometry = new THREE.CircleGeometry( 2, 32 );
var spot = new THREE.Mesh( spot_geometry, spot_mat );

var quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0), Math.PI / 2 );
spot.applyQuaternion(quaternion)
spot.name = "spot_camera_pointer"
spot.visible = false;

let ringMaterial = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.9} );
let ringGeometry = new THREE.RingBufferGeometry( 2.0, 2.4, 32 );
let ring = new THREE.Mesh( ringGeometry, ringMaterial );
spot.add( ring );

scene.add( spot );

//#endregion

//#region Light

// var sunLight  = new THREE.HemisphereLight(0xffffff, 0x000000, 0.8);
// scene.add(sunLight);

var aoLight = new THREE.AmbientLight( 0x808080 ); // soft white light
scene.add( aoLight );

// var pointLight_01 = new THREE.PointLight( 0xffffff, 0.8);
// pointLight_01.position.set( 0, 30, -30 );
// scene.add( pointLight_01 );


// //Set up shadow properties for the light
// pointLight_01.shadow.mapSize.width = 1024;  // default
// pointLight_01.shadow.mapSize.height = 1024; // default
// pointLight_01.shadow.camera.near = 0.1;    // default
// pointLight_01.shadow.camera.far = 500;     // default
// light.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.5, 1000 ); 


// //Create a DirectionalLight and turn on shadows for the light
// var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// directionalLight.position.set( -180, 100, 0 ); 			//default; light shining from top
// directionalLight.castShadow = true;            // default false
// directionalLight.shadow.radius = 100;
// scene.add( directionalLight );

// //Set up shadow properties for the light
// directionalLight.shadow.bias = -0.001;  
// directionalLight.shadow.mapSize.width = 4096;  // default
// directionalLight.shadow.mapSize.height = 4096; // default
// directionalLight.shadow.camera.near = 0.1;    // default
// directionalLight.shadow.camera.far = 5000;     // default


// const d = 300;
// directionalLight.shadow.camera.left = - d;
// directionalLight.shadow.camera.right = d;
// directionalLight.shadow.camera.top = d;
// directionalLight.shadow.camera.bottom = - d;


// scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );
//#endregion

//Test light

//Create a PointLight and turn on shadows for the light
var light_01 = new THREE.PointLight( 0xffffff, 1, 1000 );
light_01.position.set( 4.1, 2, -0.2 );
light_01.castShadow = true;            // default false
scene.add( light_01 );

//Set up shadow properties for the light
light_01.shadow.mapSize.width = 1024;  // default
light_01.shadow.mapSize.height = 1024; // default
light_01.shadow.camera.near = 0.05;       // default
light_01.shadow.camera.far = 300    // default

light_01.shadow.bias = -0.0001;


//Create a DirectionalLight and turn on shadows for the light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
directionalLight.position.set( 20, 20, -20 ); 			//default; light shining from top
directionalLight.castShadow = true;            // default false
directionalLight.shadow.radius = 1;
// scene.add( directionalLight );


//Set up shadow properties for the light
directionalLight.shadow.bias = -0.00001;  
directionalLight.shadow.mapSize.width = 1024;  // default
directionalLight.shadow.mapSize.height = 1024; // default
directionalLight.shadow.camera.near = 0.1;    // default
directionalLight.shadow.camera.far = 10000;     // default

const d = 15;
directionalLight.shadow.camera.left = - d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = - d;

// scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );

//Create a sphere that cast shadows (but does not receive them)
var light_01_geometry = new THREE.SphereBufferGeometry( 0.03, 32, 32 );
var light_01_object = new THREE.Mesh( light_01_geometry, light_mat );
light_01_object.position.set( 0, 2.5, 0 );
light_01_object.name = "light_01";
scene.add( light_01_object );


//Create a helper for the shadow camera (optional)
var helper = new THREE.CameraHelper( light_01.shadow.camera );
scene.add( helper );




function addSelectedObject( object ) 
{
	selectedObjects = [];
	selectedObjects.push( object );
}

function checkIntersection() 
{
	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObject( scene, true );

	if ( intersects.length > 0 ) 
	{
		var selectedObject = intersects[ 0 ].object;

		//Check if plan, get point to move
		if(selectedObject)
		{
			if(selectedObject.name === "FloorSurface")
			{
				outlinePass.selectedObjects = [];
				// spot.visible = false;
			}
			if(selectedObject.name !== "spot_camera_pointer" )
			{
				addSelectedObject( selectedObject );
				outlinePass.selectedObjects = selectedObjects;
			}
		}
	} 
	else {
		outlinePass.selectedObjects = [];
		// spot.visible = false;
	}
}

function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function onMousedblClick( event ) {

	console.log(outlinePass.selectedObjects);

	if(outlinePass.selectedObjects.length === 0)
	{
		fadeOut(material_select_container);
		console.log("Hide element");
	}
	else
	{
		fadeIn(material_select_container);

		if(outlinePass.selectedObjects[0] === light_01_object)
		{
			if(light_01.intensity > 0)
			{
				light_01.intensity = 0;
				light_01_object.material = glass_mat;
			}
			else
			{
				light_01.intensity = 1;
				light_01_object.material = light_mat;
			}
		}

		console.log("Show element");
	}

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onMouseMove( event ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	checkIntersection();
}

function onMouseClickMaterialItem(event) {
	console.log(event.target.id);
}



//Add Event for material iamge
var material_iamge_items = document.getElementsByClassName("material_item_image");
for(var i = 0; i < material_iamge_items.length; i++)
{
    material_iamge_items[i].addEventListener("click", onMouseClickMaterialItem);
}


//Add event Window
window.addEventListener( 'dblclick', onMousedblClick, true );
window.addEventListener('mousemove', onMouseMove, true);

init()
render();

function init() {
	// MODEL

	// RectAreaLightUniformsLib.init();

	// var rectLight = new THREE.RectAreaLight( 0xffffff, 30, 6, 2.5 );
	// rectLight.position.set( 6, 1.75, -1 );
	// var quaternion = new THREE.Quaternion();
	// quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0), Math.PI / 2 );
	// rectLight.applyQuaternion(quaternion)

	// scene.add( rectLight );

	// var rectLightHelper = new RectAreaLightHelper( rectLight );
	// rectLight.add( rectLightHelper );



	

	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
	  '../Libs/ThreeJs/textures/cube/Park2/posx.jpg',
	  '../Libs/ThreeJs/textures/cube/Park2/negx.jpg',
	  '../Libs/ThreeJs/textures/cube/Park2/posy.jpg',
	  '../Libs/ThreeJs/textures/cube/Park2/negy.jpg',
	  '../Libs/ThreeJs/textures/cube/Park2/posz.jpg',
	  '../Libs/ThreeJs/textures/cube/Park2/negz.jpg',
	]);
	scene.background = texture;


	loadModelWithHDR();
	readModel();

	composer = new EffectComposer( renderer );

	var renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );

	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	outlinePass.edgeStrength = Number( 10 );
	outlinePass.edgeGlow = Number( 0);
	outlinePass.edgeThickness = Number( 1 );
	outlinePass.pulsePeriod = Number( 0 );
	outlinePass.visibleEdgeColor.set( "#ffffff" );
	outlinePass.hiddenEdgeColor.set( "#000000" );
	composer.addPass( outlinePass );

	bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.1, 0.05, 0.2 );
	// composer.addPass( bloomPass );

	// composer.addPass( saoPass );
	var pixelRatio = 1;
	if (window.devicePixelRatio !== undefined) {
		pixelRatio = window.devicePixelRatio;
	}

	effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
	effectFXAA.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
	composer.addPass( effectFXAA ); 


	// Add Controls Attributer
	// controls.ground.push( floor_plane );
	controls.addEventListener( 'move', function ( event ) 
	{
		// console.log(controls.ground);
		let intersect = event.intersect;
		// console.log(intersect);
		console.log(intersect.object.name);
		if(intersect.object.name === "FloorSurface")
		{

			spot.visible = true;

			console.log("interPoint: ")
			console.log(intersect.point );
			spot.position.set( intersect.point.x, intersect.point.y + 0.05, intersect.point.z );
			console.log("Spot: ")
			console.log(spot.position );
			// spot.position.addScaledVector( normal, 0.001 );
			controls.enabled_move = true;


			// let normal = intersect.face.normal;
			// if ( normal.z !== 1) 
			// {
			// 	spot.visible = false;
			// 	controls.enabled_move = false;
			// } else {
			// 	spot.visible = true;

			// 	console.log("interPoint: ")
			// 	console.log(intersect.point );
			// 	spot.position.set( intersect.point.x, intersect.point.y + 0.1, intersect.point.z );
			// 	console.log("Spot: ")
			// 	console.log(spot.position );
			// 	spot.position.addScaledVector( normal, 0.001 );
			// 	controls.enabled_move = true;
			// }
		}
		else
		{
			spot.visible = false;
			controls.enabled_move = false;
		}
	} );




}

async function loadModelWithHDR() {
	var pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

	var rgbeLoader = new RGBELoader()
		.setDataType( THREE.UnsignedByteType )
		.setPath( '../Libs/ThreeJs/textures/equirectangular/' );
	var [ texture] = await Promise.all( [rgbeLoader.loadAsync( 'shanghai_bund_4k.hdr' )] );
	// environment
	envMap = pmremGenerator.fromEquirectangular( texture ).texture;
	// scene.background = envMap; //Not set bG
	scene.environment = envMap;
	texture.dispose();
	pmremGenerator.dispose();
}	


function readModel() {
		// //FBXloader
		const fbxLoader = new FBXLoader();

		// //Load chair
		// fbxLoader.load('../models/fbx/Chair/source/chair.fbx', (root) => {
		// 	root.traverse( function ( child ) {
		// 		child.castShadow = true;
		// 		child.receiveShadow = true;
		// 		if ( child instanceof THREE.Mesh ) 
		// 		{
		// 			if(
		// 				child.name ==="polySurface33" || child.name ==="polySurface18" || child.name ==="polySurface17" ||
		// 				child.name ==="polySurface47" || child.name ==="polySurface32")
		// 			{
		// 				child.material = platic_mat;
		// 			}
		// 			else if(child.name ==="polySurface46" || child.name ==="polySurface48" ||
		// 					child.name ==="polySurface49" || child.name ==="polySurface50" )
		// 			{
		// 				child.material = leather_mat;
		// 			}
		// 			else if(
		// 					child.name ==="polySurface44" || child.name ==="polySurface45" ||
		// 					child.name ==="polySurface42" || child.name ==="polySurface43" ||
		// 					child.name ==="polySurface51" || child.name === "polySurface16" ||
		// 					child.name ==="polySurface27" ||  child.name ==="polySurface28" ||
		// 					child.name ==="polySurface29" ||child.name ==="polySurface30" || 
		// 					child.name ==="polySurface31")
		// 			{
		// 				child.material = wood_mat;
		// 			}
		// 		else if(
		// 			child.name ==="polySurface19" || child.name ==="polySurface24" ||
		// 			child.name ==="polySurface36" || child.name ==="polySurface37" ||
		// 			child.name ==="polySurface38" || child.name ==="polySurface39" ||
		// 			child.name ==="polySurface40" || child.name ==="polySurface41" ||
		// 			child.name ==="polySurface34" || child.name ==="polySurface35" ||
		// 			child.name ==="polySurface25" ||child.name ==="polySurface20"  ||
		// 			child.name ==="polySurface26" || child.name ==="polySurface27" ||
		// 			child.name ==="polySurface22" || child.name ==="polySurface23")
		// 			{
		// 				child.material = metal_mat;
		// 				// child.visible = false;
		// 			}
		// 		}
		// 		else
		// 		{
		// 			child.material = metal_mat;
		// 		}
		// 	} );
		// 	root.name = "chair_model_root";
		// 	scene.add(root);
		// 	// root.position.set(30,3.36,-45)
		// 	fitCameraToObject(camera, root, 15);
		// 	console.log("loaded Chair")
		// });
	
		const gltfLoader = new GLTFLoader();
		const url = './models/gltf/RoomHouse.gltf';
		// const url = '../models/gltf/Rooms/livingtable/scene.gltf';
		gltfLoader.load(url, (gltf) => 
		{
			const root = gltf.scene;
			root.traverse( function ( child ) 
			{
				var childname = child.name;
				console.log(childname);
				child.castShadow = true;
				child.receiveShadow = true;
				if(childname === "Floor")
				{
					child.material = floor_mat;
				}
				else if(childname === "GlassWindow")
				{
					child.material = glass_mat;
					child.castShadow = false;
				}
				else if(childname === "FloorSurface")
				{
					child.material = floor_mat;
					child.revi
				}

			});
			// root.scale.set(0.22, 0.22, 0.22);
			root.rotateY(-3.14/2);
			scene.add(root);
			// fitCameraToObject(camera, root, 15);
		});
	
		const url_table = '../models/gltf/Rooms/livingtable/scene.gltf';
		// const url = '../models/gltf/Rooms/livingtable/scene.gltf';
		gltfLoader.load(url_table, (gltf) => 
		{
			const root = gltf.scene;
			root.traverse( function ( child ) 
			{
				var childname = child.name;
				console.log(childname);
				child.castShadow = true;
				child.receiveShadow = true;
				if(childname === "Floor")
				{
					child.material = floor_mat;
				}
				else if(childname === "GlassWindow")
				{
					child.material = glass_mat;
					child.castShadow = false;
				}
				else if(childname === "FloorSurface")
				{
					child.material = floor_mat;
				}
				else if(childname === "WallBedRoom")
				{
					child.material = wall_mat;
				}

			});
			root.scale.set(1/175, 1/175, 1/175);
			root.position.set(-0.2, 0.48, -0.6);
			// root.rotateY(-3.14/2);
			scene.add(root);
			fitCameraToObject(camera, root, 1);
		});
	



	}

function fitCameraToObject( camera, object, offset ) {

	offset = offset || 1.5;
	
	const boundingBox = new THREE.Box3();
	
	boundingBox.setFromObject( object );
	
	const center = boundingBox.getCenter( new THREE.Vector3() );
	const size = boundingBox.getSize( new THREE.Vector3() );
	
	const startDistance = center.distanceTo(camera.position);
	// here we must check if the screen is horizontal or vertical, because camera.fov is
	// based on the vertical direction.
	const endDistance = camera.aspect > 1 ?
						((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) :
						((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) / camera.aspect ;
		camera.position.set(
		camera.position.x * endDistance / startDistance,
		camera.position.y * endDistance / startDistance+ 2,
		camera.position.z * endDistance / startDistance ,
		);
	camera.lookAt(center);
	}

onWindowResize();

function onWindowResize() {
	var w = container.clientWidth;
	var h = container.clientHeight;
	var aspect = w / h;
	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;
	camera.updateProjectionMatrix();
	renderer.setSize( w, h );
	resolution.set( w, h );
	console.log(w);
	controls.reset( camera, renderer.domElement );
}

window.addEventListener( 'resize', onWindowResize );

function render() {

	requestAnimationFrame( render );
	controls.update();
	// renderer.render( scene, camera );
	composer.render(); //This render() will show outline of object
}
//#endregion