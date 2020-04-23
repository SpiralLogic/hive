# fma-hex-renderer

[![Latest Version @ Cloudsmith](https://api-prd.cloudsmith.io/badges/version/myob/future-makers-academy/npm/@myob-fma/hex-renderer/latest/x/?badge_token=gAAAAABcZ9ZotgXHqAf2mX9qd2pSI9jsJxTemy5GCqEoAjFVDCSCBqQFsKYvru4X6st-_jeQFiITGvsbcwxOPdBk1mTO94jp1XOXtjXxTZt4FVul2ONVnGg%3D&render=true)](https://cloudsmith.io/~myob/repos/future-makers-academy/packages/detail/npm/@myob-fma%252Fhex-renderer/latest/)

## Installation

Ensure that you have the `@myob-fma` scope configured to resolve to the MYOB FMA cloudsmith repository:

```bash
$ npm config set '@myob-fma:registry' https://npm.cloudsmith.io/myob/future-makers-academy/
```

[TODO: Figure out auth instructions]

Install via npm:

```bash
$ npm i @myob-fma/hex-renderer
```

## Usage

```javascript
import { renderGame } from '@myob-fam/hex-renderer';
import { myEngine } from './path/to/my/engine';

renderGame(myEngine, document.getElementById('game-area'));
```

Check the examples directory for sample impelentations.
