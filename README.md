# Hive-fma

# Hive board game.
The game requires 2 players. You can change player by clicking either P1 or P2 in the tile list


# Requires:
- node latest
- dotnet sdk 5 latest
- pnpm 

```
npm i -g pnpm  
```

# To Run
```
dotnet run -p ./src/Api/Hive.Api
```

# To Test
```
dotnet test ./src
cd ./src/FrontEnd/
pnpm test 
```

# Run in docker
```
docker build -f ./ops/Dockerfile -t hive .
docker run -d -p 80:80 hive
```

# Develop with live watch
```
dotnet watch -v -p ./src/Api/Hive.Api run
```
open browser http://localhost


# Pipelines
* github actions for CI
* rancher config for CD (just automates all the above)
* kubernetes deployment script for k8s
