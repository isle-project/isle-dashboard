# ISLE Dashboard

<div class="image" align="center">
    <img width="250" height="auto" src="https://raw.githubusercontent.com/isle-project/www/master/images/isle_icon_transparent.png" alt="stdlib logo">
    <br>
</div>

---

#### Dependencies

[![Dependencies][dependencies-image]][dependencies-url] [![DevDependencies][dev-dependencies-image]][dev-dependencies-url] [![DOI](https://zenodo.org/badge/71033733.svg)](https://zenodo.org/badge/latestdoi/71033733)

#### Tests

[![Actions Status](https://github.com/isle-project/isle-dashboard/workflows/NodeCI/badge.svg)](https://github.com/isle-project/isle-dashboard/actions)
[![codecov](https://codecov.io/gh/isle-project/isle-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/isle-project/isle-dashboard)

## Introduction

An online dashboard used to deploy, organize and monitor *integrated statistics learning environment* (ISLE) lessons. Other parts of the ISLE environment are: 

-   the [isle-editor][isle-editor] is used to author ISLE lessons
-   the [isle-server][isle-server] is the server program responsible for user management and data storage

#### [Open Documentation][docs]

#### Prerequisites

Developing the ISLE dashboard has the following prerequisites:

* [git][git]: version control
* [Node.js][node-js]: JavaScript runtime (version `>= 10.0`)

#### Download

To acquire the source code, clone the git repository.

``` bash
$ git clone https://github.com/isle-project/isle-dashboard
```

#### Installation

To install development dependencies,

``` bash
$ npm install
```

#### Configuration

Edit the [config/server.json](https://github.com/isle-project/isle-dashboard/blob/master/config/server.json) file to change the address where the [ISLE server][isle-server] and dashboard will be hosted.

#### Bundle

Execute the `npm run build` command to create a bundle of the ISLE dashboard, which can then be hosted on the server. 

#### Deploy

Deploy the bundled page by copying to the correct path on your server. From the project directory, run 

``` bash
scp -r build/* <user>@<homepage>:<dirpath>
```

#### License

See [LICENSE][license].

#### Icon Credits

- User Icon by Atacan from the Noun Project
- Badge Icon by Royyan Wijaya from the Noun Project
- Upload Icon by McGalloway, CC BY-SA 4.0
- Badge by Kristin Hogan from the Noun Project
- Question by unlimicon from the Noun Project
- weights by José Manuel de Laá from the Noun Project
- chat by nauraicon from the Noun Project
- feedback by Delwar Hossain from the Noun Project
- avatar by Hea Poh Lin from the Noun Project

[git]: http://git-scm.com/
[license]: https://raw.githubusercontent.com/isle-project/isle-dashboard/master/LICENSE.md
[node-js]: https://nodejs.org/en/

[dependencies-image]: https://img.shields.io/david/isle-project/isle-dashboard.svg
[dependencies-url]: https://david-dm.org/isle-project/isle-dashboard/master

[dev-dependencies-image]: https://img.shields.io/david/dev/isle-project/isle-dashboard.svg
[dev-dependencies-url]: https://david-dm.org/isle-project/isle-dashboard/master?type=dev

[docs]: http://isledocs.com/
[isle-server]: https://github.com/isle-project/isle-server
[isle-editor]: https://github.com/isle-project/isle-editor
