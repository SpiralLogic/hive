# Hive

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
npm i -g pnpm  
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
docker build -f ./ops/dockerfile -t hive .
docker run -d -p 80:80 hive
```

### Develop with live watch

```
dotnet watch -v --project ./src/Api/Hive.Api run
```

open browser [https://localhost:5001](https://localhost:5001)

### Pipelines

* github actions for CI
* rancher config for CD (just automates all the above)
* kubernetes deployment script for k8s

### goals

- [x] To minimise non-dev dependencies.
- [x] use latest .net5 to try new features
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
