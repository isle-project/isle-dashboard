# ISLE Dashboard

#### Dependencies

[![Dependencies][dependencies-image]][dependencies-url] [![DevDependencies][dev-dependencies-image]][dev-dependencies-url] [![DOI](https://zenodo.org/badge/71033733.svg)](https://zenodo.org/badge/latestdoi/71033733)

#### Tests

[![Build Status](https://travis-ci.org/Planeshifter/isle-dashboard.svg?branch=master)](https://travis-ci.org/Planeshifter/isle-dashboard)
[![codecov](https://codecov.io/gh/Planeshifter/isle-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Planeshifter/isle-dashboard) [![Greenkeeper badge](https://badges.greenkeeper.io/Planeshifter/isle-dashboard.svg)](https://greenkeeper.io/)

## Introduction

An online dashboard used to deploy, organize and monitor *integrated statistics learning environment* (ISLE) lessons. Other parts of the ISLE environment are: 

-   the [isle-editor][isle-editor] is used to author ISLE lessons
-   the [isle-server][isle-server] is the server program responsible for user management and data storage

#### [Open Documentation][docs]

#### Bundle

Execute the `npm run build` command to create a bundle of the ISLE dashboard, which can then be hosted on a server. Change the `homepage` field of the `package.json` file to point to the address where the dashboard will be hosted.

#### Deploy

Deploy the bundled page by copying to the correct path on your server. From the project directory, run 

``` bash
scp -r build/* <user>@<homepage>:<dirpath>
```

#### License

See [LICENSE][license].

#### Credits

- User Icon by Atacan from the Noun Project
- Badge Icon by Royyan Wijaya from the Noun Project
- Upload Icon by McGalloway, CC BY-SA 4.0
- Badge by Kristin Hogan from the Noun Project
- Question by unlimicon from the Noun Project
- profile by Hea Poh Lin from the Noun Project
- weights by José Manuel de Laá from the Noun Project
- chat by nauraicon from the Noun Project
- feedback by Delwar Hossain from the Noun Project

[license]: https://raw.githubusercontent.com/Planeshifter/isle-dashboard/master/LICENSE

[dependencies-image]: https://img.shields.io/david/planeshifter/isle-dashboard/master.svg
[dependencies-url]: https://david-dm.org/planeshifter/isle-dashboard/master

[dev-dependencies-image]: https://img.shields.io/david/dev/planeshifter/isle-dashboard/master.svg
[dev-dependencies-url]: https://david-dm.org/planeshifter/isle-dashboard/master#info=devDependencies

[docs]: http://isledocs.com/
[isle-server]: https://github.com/Planeshifter/isle-server
[isle-editor]: https://github.com/Planeshifter/isle-editor
