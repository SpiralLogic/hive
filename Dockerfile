FROM node:12.18.1 as node-build

WORKDIR /source
COPY ./src/FrontEnd .
RUN curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node
RUN pnpm install
RUN pnpm run build
RUN pnpm test

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS dotnet-build
WORKDIR /source

# copy and publish app and libraries
COPY ./src .
RUN dotnet test /p:CollectCoverage=true /p:CoverletOutput=TestResults/ /p:CoverletOutputFormat=lcov
RUN dotnet publish -c release -o /app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=dotnet-build /app .
COPY --from=node-build /source/public ./wwwroot
ENTRYPOINT ["./Hive.Api"]
