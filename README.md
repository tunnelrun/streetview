# [Tunnel Run: Street View](https://streetview.tunnel.run/)

Proxy images from [Street View](https://www.google.com/streetview/).

**[Try it out!](https://streetview.tunnel.run/)**


## Usage

1. [Load **https://streetview.tunnel.run/**](https://streetview.tunnel.run/), and _dive_ right in!
2. Enter the latitude-longitude coordinates of a location, or click on the `Use my current location` button.
3. Enjoy! :smile:


## Installation

First, ensure [Node](https://nodejs.org/en/download/) is installed. From the command line, install the dependencies:

```sh
npm install
```


## Contributing

Feel free to [open a pull request](https://github.com/tunnelrun/streetview/pulls) or [file an issue](https://github.com/tunnelrun/streetview/issues/new). Please notice that all code in this repository is licensed under a [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

1. [Fork](https://help.github.com/articles/fork-a-repo/) [this repository](https://github.com/tunnelrun/streetview/fork) to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local computer.
2. From your command-line terminal, run `npm install` to install the [Node](https://nodejs.org/en/download/) dependencies.
3. Link `npm link` to link the local repository to [npm](https://www.npmjs.com/).
4. Run `npm run build` to build and watch for code changes.
5. Run `npm link tunnelrun.streetview` from within your project's directory.
6. Now you can run your app with the local version of `tunnelrun.streetview`.


## Development

From the command line, run this command to start the local Node server:

```sh
npm start
```

## Deployment

Upon commits pushed to `master` (and pull requests merged to `master`), a new version of the site is automatically deployed with Heroku to [production](https://streetview.tunnel.run/).


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/tunnelrun/streetview)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
