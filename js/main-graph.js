'use strict'

var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000 );
camera.position.set( 50, 10, 0 );
var frustumSize = 1000;

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
var clock = new THREE.Clock();

var colors = [
	0xed6a5a,
	0xf4f1bb,
	0x9bc1bc,
	0x5ca4a9,
	0xe6ebe0,
	0xf0b67f,
	0xfe5f55,
	0xd6d1b1,
	0xc7efcf,
	0xeef5db,
	0x50514f,
	0xf25f5c,
	0xffe066,
	0x247ba0,
	0x70c1b3
];

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

function makeLine( geo, c, w ) {

	var g = new MeshLine();
	g.setGeometry( geo );

	var material = new MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( colors[ c ] ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: !false,
		lineWidth: w,
		near: camera.near,
		far: camera.far
	});
	var mesh = new THREE.Mesh( g.geometry, material );
	graph.add( mesh );

	lines.push(mesh);
	console.log("num line" + lines.length)
}

function clearLines() {

	scene.remove( lines );
	lines.forEach( function( l ) {
		scene.remove( lines );
	} );

	lines = [];
}


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
	createLines();
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

}

window.addEventListener( 'resize', onWindowResize );

function render() {

	requestAnimationFrame( render );
	controls.update();

	renderer.render( scene, camera );

}
