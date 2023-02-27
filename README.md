# Hive
<div align="center">

[![Hive Tests](https://github.com/SpiralLogic/hive/actions/workflows/hive-tests.yml/badge.svg)](https://github.com/SpiralLogic/hive/actions/workflows/hive-tests.yml)
[![CodeQL](https://github.com/SpiralLogic/hive/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/SpiralLogic/hive/actions/workflows/codeql-analysis.yml)
</div>


## Hive board game.

The game requires 2 players. You can share a link to an opponent using the share icon and play in real time. An deployed
version can be found here (https://hive.sorijen.net.au)

The game is created by [Gen42 Games](http://gen42.com/). Here is a link to
the [original rules](https://www.gen42.com/download/rules/hive/Hive_English_Rules.pdf)

### Requires:

- node latest
- dotnet sdk 6 latest
- pnpm

```
npm i --location=global pnpm  
```

### To Run

```
dotnet build ./src
dotnet run --project ./src/Hive.Api
```

### To Test

```
dotnet test -c Test ./src
pnpm  --prefix ./src/Hive.FrontEnd test
```

### Run in docker

```
docker build -f ./ops/dockerfile.dev -t hive .
docker run -d -p 5001:5001 hive
```

### Develop with live watch

```
dotnet watch -v --project ./src/Hive.Api run
```

open browser [https://localhost:5001](https://localhost:5001)

### Pipelines


* GoCd pipelines hosted locally
* Sonar Scanning hosted locally
* github actions for CI
* kubernetes deployment script for k8s

### goals

- [x] 100% light house scores
- [x] 100% test coverage (branch, stratement and line)
- [x] To minimise non-dev dependencies.
- [x] use latest ~~.net5~~ .net6 to try new features
- [x] investigate build and bundler options
    - esbuild wins (webpack, rollup, parcel, browserify)
- [x] vanilla css3
- [x] well tested clean domain layer
- [x] all networking and hardware to be self hosted and managed on prem
- [x] apply a user centric testing to each layer aiming for 100% coverage (to understand when bang for buck runs out)
- [x] playable real time via web sockets
- [x] all SVGs self made (excluding github icon)
- [x] self created kubernetes cluster automated (inc tls)
- [x] no database instances
- [x] be accessible, mobile friendly, responsive with 100 lighthouse score
- [?] attempt ML for an AI player
- [ ] ability to find other live players
- [ ] see move history
