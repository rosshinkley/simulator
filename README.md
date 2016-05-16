# segment request simulator

Send requests to the Segment backend with the Segment libraries. A [demo](http://segment-simulator.rosshinkley.com/) is available.

## installation
`npm install` should be enough to get started.  Running the service can be done with `npm start`.

## structure

### library wrappers
At the bottom of the stack, there are library wrappers that arrange the request according to the library specification and uses the native library of the selected language to transmit the request to Segment.  The interprocess calls are accomplished over sockets, leaving the `DEBUG` messages (or other miscellaneous messages on `stdout`) to be picked up and transmitted up the stack via an `EventEmitter`.

The libraries are independent of the parent project insofar as the install and dependencies do not depend on the parent project.

### API
The API exposes a single `POST` method that allows a client to send a language, a method, and a body containing the request to send to Segment via the library specified by the language.  The response from the library is piped back from the library wrapper through the API and back to the requesting client.

### UI
The [Knockout](http://knockoutjs.com/)-based UI exposes forms for each method type as well as a raw option.  The UI also allows for language selection.

## time

* **library wrapper:** It only took about an hour to sandbox the library wrapper together and another hour for integration tests.
* **api:** 2 hours plus another hour for integration tests.
* **ui:** My weakest link.  Pulling this together took ~8 hours including testing.
* **deployment:** 1 hour.
* **docs:** 1 hour.

## future improvements

There are a _lot_ of things this project could do.  Highlight reel:

* Nightmare-based integration tests for the UI down.
* Socket.IO client-side hooks so debugging information from the library can be piped to the client.
* More UI guidance/better organization by-request to organize field entry more efficiently.
* Add more integrations.  It's a straightforward process: add the wrapper, add the wrapper to the library index so it's callable, and finally add the language to the options in the UI.
