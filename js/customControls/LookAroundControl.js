console.warn( "THREE.LookAroundControls: As part of the transition to ES6 Modules, the files in 'examples/js' were deprecated in May 2020 (r117) and will be deleted in December 2020 (r124). You can find more information about developing using ES6 Modules in https://threejs.org/docs/#manual/en/introduction/Installation." );

THREE.LookAroundControls = function ( object, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.LookAroundControls: The second parameter "domElement" is now mandatory.' );
		domElement = document;

	}

	this.object = object;
	this.domElement = domElement;

	// API
	this.activeLook = false;

	// private variables
    var moveLeft = true;
    var oldx = 0;
	//

	if ( this.domElement !== document ) {
		this.domElement.setAttribute( 'tabindex', - 1 );
	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {
			this.domElement.focus();
		}
		event.preventDefault();
		event.stopPropagation();

        switch (event.button) 
        {
            case 0:
                console.log('Left button clicked.');
                this.activeLook = true;
                break;
            case 1:
                console.log('Middle button clicked.');
                break;
            case 2:
                console.log('Right button clicked.');
                break;

        }

	};

	this.onMouseUp = function ( event ) {

        this.activeLook = false;
		event.preventDefault();
		event.stopPropagation();
	};

	this.onMouseMove = function ( event ) {

        if(this.activeLook)
        {
            if (event.pageX < oldx) {
                moveLeft = true;
            } else if (event.pageX > oldx) {
                moveLeft = false
            }
            
            oldx = event.pageX;

            var vecRot = new THREE.Vector3( 0, 1, 0 );
            if(moveLeft)
            {
                this.object.rotateOnWorldAxis (vecRot, -0.05);
            }
            else
            {
                this.object.rotateOnWorldAxis (vecRot, 0.05);
            }
        }

	};


	this.update = function () {
		return function update( ) {
		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}
	this.handleResize();
};
