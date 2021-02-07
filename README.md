# Hive

## Hive board game.
The game requires 2 players. You can change player by clicking either P1 or P2 in the tile list

### Requires:
- node latest
- dotnet sdk 5 latest
- pnpm 

```
npm i -g pnpm  
```

### To Run
```
dotnet run -p ./src/Api/Hive.Api
```

### To Test
```
dotnet test -c Test ./src
pnpm  --prefix ./src/FrontEnd test
```

### Run in docker
```
docker build -f ./ops/dockerfile -t hive .
docker run -d -p 80:80 hive
```

### Develop with live watch
```
dotnet watch -v -p ./src/Api/Hive.Api run
```

open browser [https://localhost:5001](https://localhost:5001)


### Pipelines
* github actions for CI
* rancher config for CD (just automates all the above)
* kubernetes deployment script for k8s
