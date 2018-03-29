# Gentics Mesh Angular Demo

<img src="/gentics-mesh-angular-example-screenshot.png" align="center" width="100%"><br/>
This is a simple example application intended to demonstrate a few of the features of [Gentics Mesh](https://getmesh.io/)
.

## How to run the example
The example is implemented with Angular 5.x and built with the [Angular CLI](https://github.com/angular/angular-cli).

You will need a locally running instance of the [Gentics Mesh](https://getmesh.io/) demo. You can use docker for that:
``` 
docker run -p 8080:8080 gentics/mesh-demo
``` 
Check the [documentation](https://getmesh.io/docs/beta/administration-guide.html#_run_with_docker) for details and other options.

Once the Gentics Mesh local instance is up and running you can start the example with
`npm run-script start` which will start a dev server at [http://localhost:4200/](http://localhost:4200/).
You can also use `npm run-script start` to build the project to the `dist/` directory.

## Implementation notes and caveats
All calls to the Mesh API endpoints are made from the [`MeshDataService`](src/app/mesh-data.service.ts). You can find the configured username and password for the [Mesh API](https://getmesh.io/docs/beta/raml/) calls in that file.
Angular CLI proxy configuration can be found in [proxy.conf.js](proxy.conf.js).
The rest of the application logic is contained in the [app component](src/app/app.component.ts) file.

This example is intended to be an extremely simple. Therefore the implementation is necessarily naive. The idea is to provide a way to see the [Mesh API](https://getmesh.io/docs/beta/raml/) in action and provide an example for
interested developers to experiment with.
