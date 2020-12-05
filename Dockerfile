FROM mcr.microsoft.com/dotnet/sdk:5.0 AS dotnet-build
WORKDIR /source

# copy and publish app and libraries
COPY ./src .
RUN dotnet publish -c release -o /app
COPY ./src/FrontEnd/public /app/wwwroot

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=dotnet-build /app .

ENTRYPOINT ["./Hive.Api"]
