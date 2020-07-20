// - Global variables -

// Graphics variables
var container, stats;
var camera, controls, scene, renderer;
var textureLoader;
var clock = new THREE.Clock();

var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );

// Physics variables
var gravityConstant = 7.8;
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var physicsWorld;
var margin = 0.05;
var mouse = {x: 0, y: 0};
var fbx;
var touch = false;
var tilt = false;
var beta = 0;
var gamma = 0;
var canvasMain;
var imageOpen = false;
var factor = 70;
var initial = false;
var shakeX = 0;
var shakeY = 0;
var acc = { x : 0, y : 0, z : 0}

var bound = [];
var boundShape = [];
// Rigid bodies include all movable objects
var rigidBodies = [];
var objects = [];
var objs = [];

var resizeTimeout;
var resizeX;
var resizeY;
var isAndroid = false;

var mouseGrav = {x: 0, y: 0};
var angleTimeout = false;
var tilt = false;

var tTexture = 0;

var pos = new THREE.Vector3();
var viewWidth = 0;
var quat = new THREE.Quaternion();
var transformAux1 = new Ammo.btTransform();
var tempBtVec3_1 = new Ammo.btVector3( 0, 0, 0 );

var brick;
var mouse;
var dancelab;
var agenda;
var phone;

var screenD;
var screenT;
var screenM;
var t = 0;

var objectsURI = [
	{
		uri: './panny-obj/object-1-1.obj',
		scale: [.3, .3, .3],
		color: 0xf50000
	},
	{
		uri: './panny-obj/h1.obj',
		scale: [.6, .6, .6],
		color: 0xf50000
	},
	{
		uri: './panny-obj/h2.obj',
		scale: [.2, .2, .2],
		color: 0x8a5f11
	},
	{
		uri: './panny-obj/h3.obj',
		scale: [.3, .3, .3],
		color: 0xf0ead5
	},
	{
		uri: './panny-obj/h4.obj',
		scale: [.05, .05, .05],
		color: 0xd4baf5
	},
	{
		uri: './panny-obj/h5.obj',
		scale: [.2, .2, .2],
		color: 0x63b9ff
	},
	{
		uri: './panny-obj/logo.obj',
		scale: [10, 10, 10],
		color: 0xffffff,
	},
]

var colliders = {"website": [3, 5, 3],
				"nextimage": [2.7, 2.7, 2.7],
				"reebok": [4.7, 2.5, 4.7],
				"visual": [1.8, 4, 1.8],
				"twogether": [5, 0.2, 3],
				"visual_2": [2, 4, 2],
				"visual_3": [2.1, 4, 2.1],
				"sontfwap": [5.5, 1.25, 0.2],
				"visual_4": [5, 0.2, 3],
				"IAM": [5, 3, 3],
				"boookland": [8, 2, 8],
				"visual_6": [1.1, 4, 1.1],
				"agenda": [1.4, 1.4, 4.8],
				"phone": [1.8, 0.1, 3],
				"visual_7": [1.8, 5.8, 1.8],
				"visual_8": [5, 5, 5],
				"reebok_2": [2.5, 2.5, 2.5],
				"neighborhood": [4.7, 3.7, 3.2],
				"neighborhood_2": [2.7, 3.7, 1.8],
				"everyone": [1.7, 2.5, 0.2],
				"visual_9": [4, 1.4, 4],
				"plasticpaper": [3, 4.3, 0.4],
				"ctrl_r": [1.9, 5, 1.9],
				"ctrl_r_2": [5, 1.5, 5],
				"screen": [9.5, 5.3, 1.5],
				"hervisions": [5, 5, 0.2],
				"brick": [1, 1, 3],
				"revision": [3.8, 4, 8],
				"ipad": [4, 0.1, 5.5]
			}

var time = 0;

var hdri
var hervisions_hdri
var hervisions_hdri2
var revision_hdri

$(document).ready(function(){

	if ( WEBGL.isWebGLAvailable() === false ) {
		document.body.appendChild( WEBGL.getWebGLErrorMessage() );
		document.getElementById( 'canvas--wrapper' ).innerHTML = "";
	}

	if ("ontouchstart" in document.documentElement){
		touch = true;
	}

	var ua = navigator.userAgent.toLowerCase();
	isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

	resizeX = window.innerWidth;
	resizeY = window.innerHeight;

	init();

});


function init() {
	if($("#canvas--wrapper").length > 0){
		initGraphics();
		initPhysics();
		animate();
		listeners3D();
	}
}


function listeners3D(){

	$(".tilt--prompt").click(function(){
		testDeviceOrientation();
	});

	//listen to shake event
    var shakeEvent = new Shake({threshold: 5, timeout: 20});
    shakeEvent.start();
    window.addEventListener('shake', function(){
        shakeX = Math.random() * 200 - 100;
		shakeY = Math.random() * 200 - 100;
		setTimeout(function() {
			shakeX = 0;
			shakeY = 0;
		}, 20);
    }, false);

    //stop listening
    function stopShake(){
        shakeEvent.stop();
    }

	var aT;
	// var projector = new THREE.Projector();
    $("#canvas--wrapper").mousedown(function(e){
    	angleTimeout = true;
    	clearTimeout(aT);
    	aT = setTimeout(function(){
    		angleTimeout = false;
    	}, 5000);
    	for(var i = 0; i < objects.length; i++){
    		var r1 = Math.random() * 20 - 10;
    		var r2 = Math.random() * 20 - 10;
    		var r3 = Math.random() * 20 - 10;
			// objects[i].setLinearVelocity( new Ammo.btVector3( r1, r2, r3 ) );
			objects[i].setAngularVelocity( new Ammo.btVector3( r1, r2, r3 ) );
		}
			// clicks open url
		function onDocumentMouseDown(event) {
			event.preventDefault();
			// var vector = new THREE.Vector3();
			// projector.unprojectVector(vector, camera);
			var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(pos, camera)
			// raycaster.layers.set( 1 );
			var intersects = raycaster.intersectObjects(scene.children, true);
			console.log('intersects', intersects, scene.children)
			if (intersects.length > 0) {
				// location.href = intersects[0].object.userData.URL;
			}
		}
		// onDocumentMouseDown(e)
    });

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	$(window).keydown(function(e){
		if(e.keyCode == 77){
	       addMouse();
	    }
	});

	// window.addEventListener("deviceorientation", handleOrientation, true);
	window.addEventListener("devicemotion", motion, false);

}

function initGraphics() {

	// RENDERER ********************************

	container = document.getElementById( 'canvas--wrapper' );

	canvasMain = document.getElementById("canvas");
	renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvasMain, alpha: true});
	renderer.setClearColor( 0xffffff, 0);
	renderer.antialias = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = false;

	container.innerHTML = "";
	container.appendChild( renderer.domElement );


	// CAMERA/SCENE ********************************

	camera = new THREE.OrthographicCamera( window.innerWidth / - factor, window.innerWidth / factor, (window.innerHeight * 1) / factor, (window.innerHeight * 1) / - factor, -1000, 1000 );
	camera.position.set( 0, 10, 0 );
	camera.rotation.set( 3*Math.PI/2, 0, 0 );
	scene = new THREE.Scene();


	// LIGHTS ********************************

	var ambient = new THREE.AmbientLight( 0xffffff, 0.9 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.3 );
	directionalLight.position.set( 100, 350, 250 );
	directionalLight.castShadow = true;
	scene.add( directionalLight );


	// TEXTURES ********************************

	var textureLoader = new THREE.TextureLoader( manager );

	hdri = textureLoader.load( './images/panny-yu.png' );
	hdri.mapping = THREE.SphericalReflectionMapping;

	hervisions_hdri = textureLoader.load( './images/yunpei-li.png' );
	hervisions_hdri.mapping = THREE.SphericalReflectionMapping;

	hervisions_hdri2 = textureLoader.load( './images/yushan-liu.png' );
	hervisions_hdri2.mapping = THREE.SphericalReflectionMapping;

	revision_hdri = textureLoader.load( './images/h1.png' );
	revision_hdri.mapping = THREE.SphericalReflectionMapping;


	screenD = textureLoader.load( screenDesktop.url );
	screenD.wrapS = THREE.RepeatWrapping;
	screenD.wrapT = THREE.RepeatWrapping;
	screenD.repeat.set( 1, 1 / screenDesktop.num );

	screenT = textureLoader.load( screenTablet.url );
	screenT.wrapS = THREE.RepeatWrapping;
	screenT.wrapT = THREE.RepeatWrapping;
	screenT.repeat.set( 1, 1 / screenTablet.num );

	screenM = textureLoader.load( screenMobile.url );
	screenM.wrapS = THREE.RepeatWrapping;
	screenM.wrapT = THREE.RepeatWrapping;
	screenM.repeat.set( 1, 1 / screenMobile.num );

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		// console.log( item, loaded, total );
	};
	// OBJ
	var svg = document.getElementById('svg-object');
	console.log('svg', svg)
	$.LoadingOverlay("show");
	NProgress.start();
	importObjects(0, manager)
}

function importObjects(index, manager) {
	if (index >= objectsURI.length) {
		createObjects()
		return
	}
	var objLoader = new THREE.OBJLoader( manager )
	var currentObject = objectsURI[index]
	objLoader.load( currentObject.uri, function ( readObj ) {
		// fbx = readObj;
		readObj && readObj.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh) {
				console.log('child', currentObject.uri)
				child.material = new THREE.MeshPhysicalMaterial({envMap: hervisions_hdri, roughness: 0, metalness: 1, color: currentObject.color || 0xf50000});
				var second = child.clone();
				second.material = new THREE.MeshPhysicalMaterial({envMap: hervisions_hdri, roughness: 0, metalness: 1, color: currentObject.color || 0xf50000});
				var parent = new THREE.Group();
				parent.add( second );
				parent.add( child );
				// parent.scale.set(currentObject.scale[0]*3, currentObject.scale[1]*3, currentObject.scale[2]*3)
				parent.userData.customScale = currentObject.scale
				objs.push( parent );

			}
		} );
		importObjects(index+1, manager)
	})
}


function initPhysics() {

	// Physics configuration
	collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	broadphase = new Ammo.btDbvtBroadphase();
	solver = new Ammo.btSequentialImpulseConstraintSolver();
	physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
	physicsWorld.setGravity( new Ammo.btVector3( 0, - gravityConstant, 0 ) );

}

function createObjects() {

	var w = (window.innerWidth+30)/35;
	var h = ((window.innerHeight * 1)+30)/35;

	viewWidth = w;

	// Ground
	pos.set( 0, -10, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( w, 1, h, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFF0000 } ) );
	ground.visible = false;
	ground.name = 'a';
	boundShape.push(ground);

	pos.set( 0, 20, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( w, 1, h, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFF00 } ) );
	ground.visible = false;
	ground.name = 'b';
	boundShape.push(ground);

	pos.set( 0, 0, h/2 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( w, 50, 1, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x0000FF } ) );
	ground.visible = false;
	ground.name = 'c';
	boundShape.push(ground);

	pos.set( 0, 0, -h/2 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( w, 50, 1, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x0000FF } ) );
	ground.visible = false;
	ground.name = 'd';
	boundShape.push(ground);

	pos.set( w/2, 0, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( 1, 50, h, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x0000FF } ) );
	ground.visible = false;
	ground.name = 'e';
	boundShape.push(ground);

	pos.set( -w/2, 0, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepipedWithPhysics( 1, 50, h, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0x0000FF } ) );
	ground.visible = false;
	ground.name = 'f';
	boundShape.push(ground);

	var infoHeight = w/6;
	if(mobile){
		infoHeight = w/3.6;
	}
	var infoWidth = w/1.3;
	if(mobile){
		infoWidth = w/1.25;
	}

	if(!initial){
		console.log('fbx when initialized',objs)
		makeObjects(0);
		// makeMice(5);
		// makeBrick(2);
		// makePhone(1);
		initial = true;
	}

}

function makeObjects(index){
	if (objs[index]) {
		var stoneMass = 120;
		var numStones = 20;
		quat.set( 4, 1, 4, 2 );
		console.log('objs',objs)
		var ball = objs[index].clone();
		var name = ball.name || 'visual';
		var c = colliders[name];

		pos.set( 0, 0, 1 );
		stoneMass = 120 + (Math.random()*100)-50;
		var obj = createBallsWithPhysics( ball, c, stoneMass, pos, quat, new THREE.MeshStandardMaterial( { color: 0xFFFFFF, roughness: 0, metalness: 100 } ), index );
		if(index < objs.length){
			setTimeout(function(){
				makeObjects(index + 1);
			}, 0);
		}
	} else {
		$.LoadingOverlay("hide");
		NProgress.done();
	}
}

function addMouse(){
		var ball = mouse.clone();
		var name = ball.name;
		var c = colliders[name];

		quat.set( 1, 0, 1, 1 );
		pos.set( 0, 2, 1 );
		stoneMass = 120 + (Math.random()*100)-50;

		var mice = createBallsWithPhysics( ball, c, stoneMass, pos, quat, new THREE.MeshStandardMaterial( { color: 0xFFFFFF, roughness: 0, metalness: 100 } ), 0 );
}

function createParalellepipedWithPhysics( sx, sy, sz, mass, pos, quat, material ) {

	var object = new THREE.Mesh( new THREE.BoxBufferGeometry( sx, sy, sz, 1, 1, 1 ), material );
	var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
	shape.setMargin( margin );

	createRigidBody( object, shape, mass, pos, quat);

	return object;

}

function createBallsWithPhysics( mesh, collider, mass, pos, quat, material, index ) {

	var w = window.innerWidth;
	var h = window.innerHeight;

	var ballMass = 35;
	var ballRadius = 1.2;

	if(w < 640){
		mesh.scale.set(0.04,0.04,0.04);
		var ballShape = new Ammo.btBoxShape( new Ammo.btVector3( (collider[0] * 0.4), (collider[1] * 0.4), (collider[2] * 0.4) ) );
	} else {
		if(w < 1400 && h < 1000){
			mesh.scale.set(0.075,0.075,0.075);
			var ballShape = new Ammo.btBoxShape( new Ammo.btVector3( (collider[0] * 0.75), (collider[1] * 0.75), (collider[2] * 0.75) ) );
		} else {
			var ex = (w - 1400);
			if(ex < 0){
				ex = 0;
			}
			var scale = 1 + (ex / w);
			mesh.scale.set(scale/10,scale/10,scale/10);
			var ballShape = new Ammo.btBoxShape( new Ammo.btVector3( collider[0] * scale, collider[1] * scale, collider[2] * scale ) );
		}
	}
	ballShape.setMargin( margin );
	console.log('mesh before', mesh)
	if (mesh.userData.customScale) {
		mesh.scale.set(mesh.userData.customScale[0]*3, mesh.userData.customScale[1]*3, mesh.userData.customScale[2]*3)
	}
	var pos = new THREE.Vector3(0, -10 + (1 * index), 0);
	var ang = new THREE.Quaternion();
	ang.set(5, 5, 5, 5);

	createRigidBody( mesh, ballShape, mass, pos, quat, pos, ang);

	return;

}


function createConvexHullPhysicsShape( coords ) {

	var shape = new Ammo.btConvexHullShape();

	for ( var i = 0, il = coords.length; i < il; i+= 3 ) {
		tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
		var lastOne = ( i >= ( il - 3 ) );
		shape.addPoint( tempBtVec3_1, lastOne );
	}

	return shape;

}


function createRigidBody( object, physicsShape, mass, pos, quat, vel, angVel ) {

	if ( pos ) {
		object.position.copy( pos );
	}
	else {
		pos = object.position;
	}
	if ( quat ) {
		object.quaternion.copy( quat );
	}
	else {
		quat = object.quaternion;
	}

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
	transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
	var motionState = new Ammo.btDefaultMotionState( transform );

	var localInertia = new Ammo.btVector3( 0, 0, 0 );
	physicsShape.calculateLocalInertia( mass, localInertia );

	var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
	var body = new Ammo.btRigidBody( rbInfo );

	body.setFriction( 0 );

	if ( vel ) {
		body.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) );
	}
	if ( angVel ) {
		body.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );
	}
	// object.layers.enable( 1 );
	object.userData.physicsBody = body;
	object.userData.collided = false;
	// object.userData.physicsBody.layers.enable( 1 )
	// object.scale.set(object.userData.scale[0], object.userData.scale[1], object.userData.scale[2])

	scene.add( object );

	if ( mass > 0 ) {
		rigidBodies.push( object );
		objects.push(body);

		// Disable deactivation
		body.setActivationState( 4 );
	} else {
		bound.push(body);
	}

	physicsWorld.addRigidBody( body );

	return body;
}


function animate() {

	requestAnimationFrame( animate );

	if(scrolled == 0){

		$("#canvas--wrapper").css({'opacity': 1});
		// screenD.offset.set(0, -t/(screenDesktop.num/2));
		// screenT.offset.set(0, -t/(screenTablet.num/2));
		// screenM.offset.set(0, -t/(screenMobile.num/2));
		t += 0.003;

		render();
	} else {
		$("#canvas--wrapper").css({'opacity': 0});
	}

}

function render() {

	var deltaTime = clock.getDelta();

	updatePhysics( deltaTime );

	renderer.render( scene, camera );

	time += deltaTime;

}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = event.clientX - window.innerWidth/2;
	mouse.y = event.clientY - window.innerHeight/2;
	mouseGrav.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouseGrav.y = -(event.clientY / window.innerHeight) * 2 + 1;
}


function motion(event){
  acc.x = event.accelerationIncludingGravity.x;
  acc.y = event.accelerationIncludingGravity.y;
  acc.z = event.accelerationIncludingGravity.z;
}


function updatePhysics( deltaTime ) {

	// Step world
	physicsWorld.stepSimulation( deltaTime, 10 );
	if(touch && tilt){
		var gravFactor = 4;
		if(shakeX != 0 && shakeY != 0){
			if(isAndroid){
				physicsWorld.setGravity( new Ammo.btVector3( -acc.x*30, 0, acc.y*30 ));
			} else {
				physicsWorld.setGravity( new Ammo.btVector3( acc.x*30, 0, -acc.y*30 ));
			}
		} else {
			if(isAndroid){
				physicsWorld.setGravity( new Ammo.btVector3( -acc.x * gravFactor, 0, acc.y * gravFactor ));
			} else {
				physicsWorld.setGravity( new Ammo.btVector3( acc.x * gravFactor, 0, -acc.y * gravFactor ));
			}
		}

		if(!angleTimeout){
			for(var i = 0; i < objects.length; i++){
				objects[i].setAngularVelocity( new Ammo.btVector3( 0.1, 0.1, 0.1 ) );
			}
		}

	} else {
		var gravFactor = 100;
		var gravX = (mouse.x/(window.innerWidth/2));
		var gravY = (mouse.y/(window.innerHeight/2));

		if(gravX <= -0.5){
			gravX = (gravX + 0.5) * gravFactor;
		} else {
			if(gravX >= 0.5){
				gravX = (gravX - 0.5) * gravFactor;
			} else {
				gravX = 0;
			}
		}

		if(gravY <= -0.5){
			gravY = (gravY + 0.5) * gravFactor;
		} else {
			if(gravY >= 0.5){
				gravY = (gravY - 0.5) * gravFactor;
			} else {
				gravY = 0;
			}
		}

		physicsWorld.setGravity( new Ammo.btVector3( gravX, 0, gravY ));

		if(gravX == 0 && gravY == 0 && !angleTimeout){
			for(var i = 0; i < objects.length; i++){
				objects[i].setAngularVelocity( new Ammo.btVector3( 0.1, 0.1, 0.1 ) );
			}
		}
	}

	// Update rigid bodies
	for ( var i = 0, il = rigidBodies.length; i < il; i++ ) {
		var objThree = rigidBodies[ i ];
		var objPhys = objThree.userData.physicsBody;
		var ms = objPhys.getMotionState();
		if ( ms ) {

			ms.getWorldTransform( transformAux1 );
			var p = transformAux1.getOrigin();
			var q = transformAux1.getRotation();
			objThree.position.set( p.x(), p.y(), p.z() );
			objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

			objThree.userData.collided = false;

		}
	}

	

}

