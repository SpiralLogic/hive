# Hive-fma

# Hive board game.

# Requires:
- node latest
- dotnet sdk 5 latest
- docker to run

# Front end
```
cd ./src/FrontEnd
npm install -g pnpm
pnpm install
pnpm test
```


# Back end
```
cd ./src/
dotnet restore
dotnet test
```

# Run
```
docker build -f ./ops/Dockerfile -t hive .
docker run -d -p 80:80 hive
```

open browser http://localhost

# Pipelines
* github actions for CI
* rancher config for CD (just automates all the above)
* kubernetes deployment script for k8s
