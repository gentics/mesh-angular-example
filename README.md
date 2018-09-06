# Gentics Mesh Angular Demo

<img src="/gentics-mesh-angular-example-screenshot.png" align="center" width="100%"><br/>
This is a simple example application intended to demonstrate a few of the features of [Gentics Mesh](https://getmesh.io/)
.

## How to run the example
The example is implemented with Angular 5.x and built with the [Angular CLI](https://github.com/angular/angular-cli).

You will need a locally running instance of the [Gentics Mesh](https://getmesh.io/) demo. You can use 
- docker
``` 
docker run -p 8080:8080 gentics/mesh-demo
``` 
- or download the [Gentics Mesh JAR file](https://getmesh.io/Download) and start it with
```  
  java -jar mesh-demo-X.X.X.jar
```
For more details check the [Administration Guide](https://getmesh.io/docs/beta/administration-guide.html).

Once the Gentics Mesh local instance is up and running you can start the example with
`npm start`  or `yarn start` which will start a dev server at [http://localhost:4200/demo](http://localhost:4200/demo).
You can also use `npm build`  or `yarn build` to build the project to the `dist/` directory.

## Implementation notes and caveats
All calls to the Mesh API endpoints are made from the [`MeshDataService`](src/app/mesh-data.service.ts). You can find the configured username and password for the [Mesh API](https://getmesh.io/docs/beta/raml/) calls in that file.
Angular CLI proxy configuration can be found in [proxy.conf.js](proxy.conf.js).
The rest of the application logic is contained in the [app component](src/app/app.component.ts) file.

This example is intended to be an extremely simple. Therefore the implementation is necessarily naive. The idea is to provide a way to see the [Mesh API](https://getmesh.io/docs/beta/raml/) in action and provide an example for
interested developers to experiment with.
