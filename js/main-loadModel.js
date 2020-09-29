'use strict'
var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x808080 );
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000000 );
// var camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
camera.position.set( 0, 0, 50 );
var frustumSize = 20;

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0);
var controls = new THREE.OrbitControls( camera, renderer.domElement );
var clock = new THREE.Clock();

var geometry = new THREE.PlaneGeometry( 100, 100, 32 );

var tex_loader = new THREE.TextureLoader();

//Map floor
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
var plane = new THREE.Mesh( geometry, floor_mat );

var quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0), Math.PI / 2 );
plane.applyQuaternion(quaternion)
scene.add( plane );


var pointLight_01 = new THREE.PointLight( 0xffffff, 0.6 );
pointLight_01.position.y = 20;
scene.add( pointLight_01 );

var pointLight_02 = new THREE.PointLight( 0xffffff, 1.0 );
pointLight_02.position.x = 30;
pointLight_02.position.y = 30;
pointLight_02.position.z = 7;
scene.add( pointLight_02 );

var lines = [];
var Params = function() {
	this.lineWidth = 0.001;
	this.update = function() {
		clearLines();
		createLines();
	}
};

var params = new Params();
var gui = new dat.GUI();

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
var graph = new THREE.Object3D();
scene.add( graph );

init()
render();


window.addEventListener( 'load', function() {

	function update() {
		clearLines();
		createLines();
		console.log(params.lineWidth)
		
	}

	gui.add( params, 'lineWidth', 0.001, 0.01 ).onChange( update );
	gui.add( params, 'update' );

} );


function init() {
	// createLines();
	readModel();
}


function createLines() {

	var line = new Float32Array( 600 );
	for( var j = 0; j < 200 * 3; j += 3 ) {
		line[ j ] = -30 + .1 * j;
		line[ j + 1 ] = 5 * Math.sin( .01 *  j );
		line[ j + 2 ] = -20;
	}
	makeLine( line, 0, params.lineWidth );

	var line = new Float32Array( 600 );
	for( var j = 0; j < 200 * 3; j += 3 ) {
		line[ j ] = -30 + .1 * j;
		line[ j + 1 ] = 5 * Math.cos( .02 *  j );
		line[ j + 2 ] = -10;
	}
	makeLine( line, 1, params.lineWidth *5 );

	var line = new Float32Array( 600 );
	for( var j = 0; j < 200 * 3; j += 3 ) {
		line[ j ] = -30 + .1 * j;
		line[ j + 1 ] = 5 * Math.sin( .01 *  j ) * Math.cos( .005 * j );
		line[ j + 2 ] = 0;
	}
	makeLine( line, 2, params.lineWidth * 10);

	var line = new Float32Array( 600 );
	for( var j = 0; j < 200 * 3; j += 3 ) {
		line[ j ] = -30 + .1 * j;
		line[ j + 1 ] = .02 * j + 5 * Math.sin( .01 *  j ) * Math.cos( .005 * j );
		line[ j + 2 ] = 10;
	}
	makeLine( line, 4, params.lineWidth * 15);

	var line = new Float32Array( 600 );
	for( var j = 0; j < 200 * 3; j += 3 ) {
		line[ j ] = -30 + .1 * j;
		line[ j + 1 ] = Math.exp( .005 * j );
		line[ j + 2 ] = 20;
	}
	makeLine( line, 5, params.lineWidth * 20 );

	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	line.vertices.push( new THREE.Vector3( 30, -30, -30 ) );
	makeLine( line, 3, 0.005 );

	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	line.vertices.push( new THREE.Vector3( -30, 30, -30 ) );
	makeLine( line, 3, 0.005 );

	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	line.vertices.push( new THREE.Vector3( -30, -30, 30 ) );
	makeLine( line, 3, 0.005 );

}

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

// var map_metal = tex_loader.load( './models/fbx/Chair/textures/chair_leather_BaseColor.jpg' );
// var map_normal = tex_loader.load( './models/fbx/Chair/textures/chair_leather_Normal.jpg' );
// var map_rounghness = tex_loader.load( './models/fbx/Chair/textures/chair_leather_BaseColor.jpg' );`
// immediately use the texture for material creation
// var leather_mat = new THREE.MeshPhysicalMaterial( { map: map_text, metalnessMap:map_metal, normalMap: map_normal, roughnessMap:map_rounghness } );
var leather_mat = new THREE.MeshPhysicalMaterial( { map: map_text_leather,  normalMap: map_normal_leather } );
var metal_mat = new THREE.MeshPhysicalMaterial( { map: map_text_metal,  metalnessMap:map_metalness_metal, roughnessMap:map_rounghness_metal } );
var wood_mat = new THREE.MeshPhysicalMaterial( { map: map_text_wood,  normalMap:map_normal_wood, roughnessMap:map_rounghness_wood } );
var platic_mat = new THREE.MeshPhysicalMaterial( {  map: map_text_platic,  normalMap:map_normal_platic, roughnessMap:map_rounghness_platic} );


function readModel() {

    {

		// // OBJLoader
		// const objLoader = new THREE.OBJLoader();

		// objLoader.load('./models/obj/hsat_mk3/source/hsat_mk3.obj', (root) => {
		// 	root.traverse( function ( child ) {

		// 		if ( child instanceof THREE.Mesh ) {
		// 			child.material = materials;
		// 		}

		// 	} );
		// 	scene.add(root);
		// });


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
		});

		// // instantiate a loader
		// var pcdLoader = new THREE.PCDLoader();
		// // load a resource
		// pcdLoader.load(
		// 	// resource URL
		// 	'./models/pcd/binary/a.pcd',
		// 	// called when the resource is loaded
		// 	function ( mesh ) 
		// 	{
		// 		scene.add( mesh );
		// 		console.log('Add Mesh');
		// 		fitCameraToObject(camera, mesh, 1.2);
		// 	},
		// 	// called when loading is in progresses
		// 	function ( xhr ) 
		// 	{
		// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				
		// 	},
		// 	// called when loading has errors
		// 	function ( error ) 
		// 	{
		// 		console.log( 'An error happened' );
		// 	}
		// );

	}
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
		camera.position.y * endDistance / startDistance,
		camera.position.z * endDistance / startDistance,
		);
	camera.lookAt(center);
	console.log("hello cu")
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

	renderer.render( scene, camera );

}
