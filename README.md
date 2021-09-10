# ISLE Dashboard [![LICENSE][license-image]][license-url] [![DOI][doi-image]][doi-url]

<div class="image" align="center">
    <img width="250" height="auto" src="https://raw.githubusercontent.com/isle-project/www/master/images/isle_icon_transparent.png" alt="ISLE logo">
    <br>
</div>

---

#### Dependencies

[![Dependencies][dependencies-image]][dependencies-url] 
[![DevDependencies][dev-dependencies-image]][dev-dependencies-url]

#### Tests

[![Actions Status][actions-image]][actions-url]
[![codecov][codecov-image]][codecov-url]

## Introduction

An online dashboard used to deploy, organize and monitor *integrated statistics learning environment* (ISLE) lessons. Other parts of the ISLE environment are: 

-   the [isle-editor][isle-editor] is used to author ISLE lessons
-   the [isle-server][isle-server] is the server program responsible for user management and data storage

#### [Open Documentation][docs]

## Deployment

The `build` branch of the repository can be used to deploy the ISLE dashboard. On the server running the `isle-server` program, simply clone the repository in an appropriate location (e.g., `/var/www/html`) and change the [`nginx` configuration][nginx-configuration] file to point to the `isle-dashboard` folder.

``` bash
git clone -b build https://github.com/isle-project/isle-dashboard.git
```

## Building from Source

#### Prerequisites

Developing the ISLE dashboard has the following prerequisites:

* [git][git]: version control
* [Node.js][node-js]: JavaScript runtime (version `>= 14.0`)

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

#### Deployment of the bundle

Deploy the bundled page by copying to the correct path on your server. From the project directory, run 

``` bash
scp -r build/* <user>@<homepage>:<dirpath>
```

#### License

See [LICENSE][license-url].

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
[node-js]: https://nodejs.org/en/

[license-image]: https://img.shields.io/badge/license-APGL-blue.svg
[license-url]: https://raw.githubusercontent.com/isle-project/isle-dashboard/master/LICENSE

[actions-image]: https://github.com/isle-project/isle-dashboard/workflows/NodeCI/badge.svg
[actions-url]: https://github.com/isle-project/isle-dashboard/actions

[doi-image]: https://zenodo.org/badge/71033733.svg
[doi-url]: https://zenodo.org/badge/latestdoi/71033733

[dependencies-image]: https://img.shields.io/david/isle-project/isle-dashboard.svg
[dependencies-url]: https://david-dm.org/isle-project/isle-dashboard/master

[dev-dependencies-image]: https://img.shields.io/david/dev/isle-project/isle-dashboard.svg
[dev-dependencies-url]: https://david-dm.org/isle-project/isle-dashboard/master?type=dev

[codecov-image]: https://codecov.io/gh/isle-project/isle-dashboard/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/isle-project/isle-dashboard

[docs]: http://isledocs.com/
[isle-server]: https://github.com/isle-project/isle-server
[isle-editor]: https://github.com/isle-project/isle-editor
[nginx-configuration]: https://github.com/isle-project/isle-server/blob/13710ded84d07de94b4e17aae6e92f4844764f4e/etc/nginx/sites-available/isle#L73
