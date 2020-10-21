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

//Hdri
import { RGBELoader } from '../Libs/ThreeJs/jsm/loaders/RGBELoader.js';

//Shader
import { FXAAShader } from '../Libs/ThreeJs/jsm/shaders/FXAAShader.js';

//Control
import { IndoorControls } from '../Libs/ThreeJs/jsm/controls/IndoorControls.js';

//#endregion


//#region  main func

//Setup SCene
var container = document.getElementById( 'container' );
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x808080 );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000000 );
camera.position.set( 0, 0, 50 );
var frustumSize = 20;
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
var pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();

//Create Control
var controls = new IndoorControls( camera, renderer.domElement, scene ) ;
var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

//Global variable
//Select by mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedObjects = [];
var composer, effectFXAA, outlinePass;


//#region Material
//Texture Loader
var tex_loader = new THREE.TextureLoader();
//#region Floor Mat


//#endregion

//#region  Spot Material
var spot_mat = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide, transparent: true, opacity: 0.3} );

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

//#region Floor Plan
var floor_geometry = new THREE.PlaneGeometry( 150, 150, 32 );
var floor_plane = new THREE.Mesh( floor_geometry, spot_mat );

floor_plane.position.set( 30, 1, 0 );

var quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0), Math.PI / 2 );
floor_plane.applyQuaternion(quaternion)
floor_plane.name = "main_floor"
scene.add( floor_plane );
//#endregion

//#region Spot Geo
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
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 ); 
scene.add(hemiLight);

var pointLight_01 = new THREE.PointLight( 0xffffff, 0.2 );
pointLight_01.position.y = 20;
scene.add( pointLight_01 );

//#endregion


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
			if(selectedObject.name === "main_floor")
			{
				outlinePass.selectedObjects = [];
				spot.visible = false;
			}
			else if(selectedObject.name !== "spot_camera_pointer" )
			{
				addSelectedObject( selectedObject );
				outlinePass.selectedObjects = selectedObjects;
			}
		}
	} 
	else {
		outlinePass.selectedObjects = [];
		spot.visible = false;
	}
}


function onMousedblClick( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onMouseMove( event ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	checkIntersection();
}

//Add event
window.addEventListener( 'dblclick', onMousedblClick, true );
window.addEventListener('mousemove', onMouseMove, true);

init()
render();

function init() {
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
	readModel();

	loadModelWithHDR();


	// Add Controls Attributer
	controls.ground.push( floor_plane );
	controls.addEventListener( 'move', function ( event ) 
	{

		// console.log(controls.ground);
		let intersect = event.intersect;
		let normal = intersect.face.normal;

		if ( normal.z !== 1) 
		{
			spot.visible = false;
			controls.enabled_move = false;
		} else {

			spot.position.set( 0, 0, 0 );
			spot.position.copy( intersect.point );
			spot.position.addScaledVector( normal, 0.001 );

			spot.visible = true;
			controls.enabled_move = true;
		}
	} );


	
}

async function loadModelWithHDR() {
	var pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

	var rgbeLoader = new RGBELoader()
		.setDataType( THREE.UnsignedByteType )
		.setPath( '../Libs/ThreeJs/textures/equirectangular/' );

	// var gltfLoader = new GLTFLoader().setPath( '../models/gltf/chair/' );

	var [ texture, gltf ] = await Promise.all( [
		rgbeLoader.loadAsync( 'venice_sunset_1k.hdr' ),
		// gltfLoader.loadAsync( 'scene.gltf' ),
	] );
	// environment

	var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

	// scene.background = envMap; //Not set bG
	scene.environment = envMap;

	texture.dispose();
	pmremGenerator.dispose();

	// // model
	// gltf.scene.scale.set(0.02,0.02,0.02);
	// scene.add(gltf.scene)
}	


function readModel() {
		// //FBXloader
		const fbxLoader = new FBXLoader();
		fbxLoader.load('../models/fbx/Chair/source/chair.fbx', (root) => {
			var num = 0;
			root.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) 
				{
					if(
						child.name ==="polySurface33" || child.name ==="polySurface18" || child.name ==="polySurface17" ||
						child.name ==="polySurface47" || child.name ==="polySurface32")
					{
						child.material = platic_mat;
					}
					else if(child.name ==="polySurface46" || child.name ==="polySurface48" ||
							child.name ==="polySurface49" || child.name ==="polySurface50" )
					{
						child.material = leather_mat;
					}
					else if(
							child.name ==="polySurface44" || child.name ==="polySurface45" ||
							child.name ==="polySurface42" || child.name ==="polySurface43" ||
							child.name ==="polySurface51" || child.name === "polySurface16" ||
							child.name ==="polySurface27" ||  child.name ==="polySurface28" ||
							child.name ==="polySurface29" ||child.name ==="polySurface30" || 
							child.name ==="polySurface31")
					{
						child.material = wood_mat;
					}
				else if(
					child.name ==="polySurface19" || child.name ==="polySurface24" ||
					child.name ==="polySurface36" || child.name ==="polySurface37" ||
					child.name ==="polySurface38" || child.name ==="polySurface39" ||
					child.name ==="polySurface40" || child.name ==="polySurface41" ||
					child.name ==="polySurface34" || child.name ==="polySurface35" ||
					child.name ==="polySurface25" ||child.name ==="polySurface20"  ||
					child.name ==="polySurface26" || child.name ==="polySurface27" ||
					child.name ==="polySurface22" || child.name ==="polySurface23")
					{
						child.material = metal_mat;
						// child.visible = false;
					}
				}
				else
				{
					child.material = metal_mat;
				}
			} );
			scene.add(root);
			root.position.set(20,0,0)
			fitCameraToObject(camera, root, 15);
			console.log("loaded Chair")
		});
	
			//FBXloader
			fbxLoader.load('../models/fbx/House/HouseModel.fbx', (root) => {
				var num = 0;
				root.traverse( function ( child ) {
					console.log(child.name);
					if(child.name === "FloorSurface")
					{
						// child.material = floor_mat;
						//Map floor 1
						var map_text_floor = tex_loader.load( '../models/fbx/house/Texture/narrow-floorboards1-ue/narrow-floorboards1-albedo.png' );

						var map_normal_floor = tex_loader.load( '../models/fbx/house/Texture/narrow-floorboards1-ue/narrow-floorboards1-normal-dx.png' );

						var map_roughness_floor = tex_loader.load( '../models/fbx/house/Texture/narrow-floorboards1-ue/narrow-floorboards1-roughness.png');

						var map_displacementMap_floor = tex_loader.load( '../models/fbx/house/Texture/narrow-floorboards1-ue/narrow-floorboards1-height.png');

						var map_aoMap_floor = tex_loader.load( '../models/fbx/house/Texture/narrow-floorboards1-ue/narrow-floorboards1-ao.png');

						var floor_surface_mat = new THREE.MeshPhongMaterial( { map: map_text_floor,
							side: THREE.DoubleSide} );;

						child.material = floor_surface_mat;

						console.log(child.material);
					}
				} );
				root.scale.set(0.5,0.5,0.5);
				root.position.set(30,0,30)
				// root.rotateOnAxis(new THREE.Vector3(1,0,0), -3.14/2);
				scene.add(root);
				console.log("loaded House")
				// fitCameraToObject(camera, root, 15);
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
		camera.position.y * endDistance / startDistance+ 25,
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