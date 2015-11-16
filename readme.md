# Mesh Angular Demo

This is a simple example application intended to demonstrate a few of the features of Gentics Mesh 
([getmesh.io](http://getmesh.io)).

All calls to the Mesh API endpoints are made from the [`meshService`](app/meshService.js). The rest of the 
app logic is contained in the [app.js](app/app.js) file.

The app is built with AngularJS and loads the required vendor resources (AngularJS, Angular Router, Bootstrap CSS)
from a CDN. Therefore an Internet connection is required for the app to function.

This is intended to be an extremely simple example. Therefore no build system is used and the implementations
are necessarily naive. The idea is to provide a way to see the Mesh API in action and provide an example for
interested developers to experiment with.