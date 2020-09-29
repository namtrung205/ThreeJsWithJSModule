'use strict'
var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x808080 );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000000 );
camera.position.set( 0, 0, 50 );
var frustumSize = 20;
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0);

var controls = new THREE.LookAroundControls( camera, renderer.domElement );
controls.activeLook = false;

var pointClicked;
var validClick = false;

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

//#region Material
//Texture Loader
var tex_loader = new THREE.TextureLoader();
//#region Floor Mat
//Map floor 1
var map_text_floor = tex_loader.load( './models/fbx/Floor/texture_floor_01_PBR/Stone_Tiles_004_basecolor.jpg' );
map_text_floor.wrapS = THREE.RepeatWrapping;
map_text_floor.wrapT = THREE.RepeatWrapping;
map_text_floor.repeat.set(10, 10);

var map_normal_floor = tex_loader.load( './models/fbx/Floor/texture_floor_01_PBR/Stone_Tiles_004_normal.jpg' );
map_normal_floor.wrapS = THREE.RepeatWrapping;
map_normal_floor.wrapT = THREE.RepeatWrapping;
map_normal_floor.repeat.set(10, 10);

var map_roughness_floor = tex_loader.load( './models/fbx/Floor/texture_floor_01_PBR/Stone_Tiles_004_roughness.jpg');
map_roughness_floor.wrapS = THREE.RepeatWrapping;
map_roughness_floor.wrapT = THREE.RepeatWrapping;
map_roughness_floor.repeat.set(10, 10);

var map_displacementMap_floor = tex_loader.load( './models/fbx/Floor/texture_floor_01_PBR/Stone_Tiles_004_height.png');
map_displacementMap_floor.wrapS = THREE.RepeatWrapping;
map_displacementMap_floor.wrapT = THREE.RepeatWrapping;
map_displacementMap_floor.repeat.set(10, 10);


var map_aoMap_floor = tex_loader.load( './models/fbx/Floor/texture_floor_01_PBR/Stone_Tiles_004_ambientOcclusion.jpg');
map_aoMap_floor.wrapS = THREE.RepeatWrapping;
map_aoMap_floor.wrapT = THREE.RepeatWrapping;
map_aoMap_floor.repeat.set(10, 10);

var floor_mat = new THREE.MeshPhysicalMaterial( { map: map_text_floor,  normalMap: map_normal_floor,
	roughnessMap:map_roughness_floor,displacementMap: map_displacementMap_floor , aoMap:map_aoMap_floor,
	side: THREE.DoubleSide} );


//Map floor alternative
var map_text_floor_alt = tex_loader.load( './models/fbx/Floor/texture_floor_02_PBR/Stylized_Stone_Floor_001_basecolor.jpg' );
map_text_floor_alt.wrapS = THREE.RepeatWrapping;
map_text_floor_alt.wrapT = THREE.RepeatWrapping;
map_text_floor_alt.repeat.set(10, 10);

var map_normal_floor_alt = tex_loader.load( './models/fbx/Floor/texture_floor_02_PBR/Stylized_Stone_Floor_001_normal.jpg' );
map_normal_floor_alt.wrapS = THREE.RepeatWrapping;
map_normal_floor_alt.wrapT = THREE.RepeatWrapping;
map_normal_floor_alt.repeat.set(10, 10);

var map_roughness_floor_alt = tex_loader.load( './models/fbx/Floor/texture_floor_02_PBR/Stylized_Stone_Floor_001_roughness.jpg');
map_roughness_floor_alt.wrapS = THREE.RepeatWrapping;
map_roughness_floor_alt.wrapT = THREE.RepeatWrapping;
map_roughness_floor_alt.repeat.set(10, 10);

var map_displacementMap_floor_alt  = tex_loader.load( './models/fbx/Floor/texture_floor_02_PBR/Stylized_Stone_Floor_001_height.png');
map_displacementMap_floor_alt.wrapS = THREE.RepeatWrapping;
map_displacementMap_floor_alt.wrapT = THREE.RepeatWrapping;
map_displacementMap_floor_alt.repeat.set(10, 10);


var map_aoMap_floor_alt = tex_loader.load( './models/fbx/Floor/texture_floor_02_PBR/Stylized_Stone_Floor_001_ambientOcclusion.jpg');
map_aoMap_floor_alt.wrapS = THREE.RepeatWrapping;
map_aoMap_floor_alt.wrapT = THREE.RepeatWrapping;
map_aoMap_floor_alt.repeat.set(10, 10);

var floor_mat_alternative = new THREE.MeshPhysicalMaterial( { map: map_text_floor_alt,  normalMap: map_normal_floor_alt,
	roughnessMap:map_roughness_floor_alt,displacementMap: map_displacementMap_floor_alt , aoMap:map_aoMap_floor_alt,
	side: THREE.DoubleSide} );

//#endregion

//#region  Spot Material
var spot_mat = new THREE.MeshPhysicalMaterial( {side: THREE.DoubleSide} );

//#endregion


//#region Chair Material

//Leather
var map_text_leather = tex_loader.load( './models/fbx/Chair/textures/chair_leather_BaseColor.jpg' );
var map_normal_leather = tex_loader.load( './models/fbx/Chair/textures/chair_leather_Normal.jpg' );
//metal
var map_text_metal = tex_loader.load( './models/fbx/Chair/textures/chair_metal_BaseColor.jpg' );
var map_metalness_metal = tex_loader.load( './models/fbx/Chair/textures/chair_metal_Roughness.jpg' );
var map_rounghness_metal = tex_loader.load( './models/fbx/Chair/textures/chair_metal_Roughness.jpg' );
//Wood
var map_text_wood = tex_loader.load( './models/fbx/Chair/textures/chair_wood_BaseColor.jpg' );
var map_normal_wood= tex_loader.load( './models/fbx/Chair/textures/chair_wood_Normal.jpg' );
var map_rounghness_wood = tex_loader.load( './models/fbx/Chair/textures/chair_wood_Roughness.jpg' );
//platic
var map_text_platic = tex_loader.load( './models/fbx/Chair/textures/chair_plastic_BaseColor.jpg' );
var map_normal_platic = tex_loader.load( './models/fbx/Chair/textures/chair_plastic_Normal.jpg' );
var map_rounghness_platic = tex_loader.load( './models/fbx/Chair/textures/chair_plastic_Roughness.jpg' );

//Material
var leather_mat = new THREE.MeshPhysicalMaterial( { map: map_text_leather,  normalMap: map_normal_leather } );
var metal_mat = new THREE.MeshPhysicalMaterial( { map: map_text_metal,  metalnessMap:map_metalness_metal, roughnessMap:map_rounghness_metal } );
var wood_mat = new THREE.MeshPhysicalMaterial( { map: map_text_wood,  normalMap:map_normal_wood, roughnessMap:map_rounghness_wood } );
var platic_mat = new THREE.MeshPhysicalMaterial( {  map: map_text_platic,  normalMap:map_normal_platic, roughnessMap:map_rounghness_platic} );

//#endregion

//#endregion

//#region Floor Plan
var floor_geometry = new THREE.PlaneGeometry( 100, 100, 32 );
var floor_plane = new THREE.Mesh( floor_geometry, floor_mat_alternative );

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
scene.add( spot );

//#endregion


//#region Light
var pointLight_01 = new THREE.PointLight( 0xffffff, 0.6 );
pointLight_01.position.y = 20;
scene.add( pointLight_01 );

var pointLight_02 = new THREE.PointLight( 0xffffff, 1.0 );
pointLight_02.position.x = 30;
pointLight_02.position.y = 30;
pointLight_02.position.z = 7;
scene.add( pointLight_02 );
//#endregion

//#region DAT GUI
//Para for GUI
var Params = function() {
	this.lineWidth = 0.001;
	this.update = function() {
		// clearLines();
		// createLines();
	}
};

var params = new Params();
var gui = new dat.GUI();

//#endregion

//Select by mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedObjects = [];
var composer, effectFXAA, outlinePass;

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
				spot.visible = true;
				// console.log(intersects[ 0 ].point);
				spot.position.x = intersects[ 0 ].point.x;
				spot.position.y = intersects[ 0 ].point.y-0.1;
				spot.position.z = intersects[ 0 ].point.z;
				outlinePass.selectedObjects = [];
			}
			else if(selectedObject.name !== "spot_camera_pointer" )
			{
				addSelectedObject( selectedObject );
				outlinePass.selectedObjects = selectedObjects;
				spot.visible = false;;
			}
		}
	} 
	else {
		outlinePass.selectedObjects = [];
		spot.visible = false;
	}
}


function onMousedblClick( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	if(spot.visible)
	{
		console.log(spot.position);

		camera.position.x = spot.position.x;
		camera.position.z = spot.position.z;
	}


}

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity": { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec4 texel = texture2D( tDiffuse, vUv );",
		"	gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};

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
	composer = new THREE.EffectComposer( renderer );

	var copyPass = new THREE.ShaderPass( THREE.CopyShader );
	copyPass.renderToScreen = true;
	composer.addPass( copyPass );

	var renderPass = new THREE.RenderPass( scene, camera );
	composer.addPass( renderPass );

	outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	outlinePass.edgeStrength = Number( 10 );
	outlinePass.edgeGlow = Number( 0);
	outlinePass.edgeThickness = Number( 1 );
	outlinePass.pulsePeriod = Number( 0 );
	outlinePass.visibleEdgeColor.set( "#ffffff" );
	outlinePass.hiddenEdgeColor.set( "#000000" );
	composer.addPass( outlinePass );
	readModel();
}

function readModel() {
		//FBXloader
		const fbxLoader = new THREE.FBXLoader();
		fbxLoader.load('./models/fbx/Chair/source/chair.fbx', (root) => {
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
			console.log("loaded FBX")
			fitCameraToObject(camera, root, 15);
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
		camera.position.y * endDistance / startDistance+ 15,
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

}

window.addEventListener( 'resize', onWindowResize );

function render() {

	requestAnimationFrame( render );
	controls.update();

	// renderer.render( scene, camera );
	composer.render(); //This render() will show outline of object
}

