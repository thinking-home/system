# BUILD .NET CORE APP

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# install node
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs

# copy csproj and restore as distinct layers
WORKDIR /app
COPY . .
RUN dotnet restore

# publish
RUN dotnet publish -c Release -o dist

# PREPARE RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# install utils
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y locales tzdata wget iputils-ping

# lang
ENV LANG=en_US.UTF-8
RUN locale-gen "en_US.UTF-8" && dpkg-reconfigure --frontend noninteractive locales

# timezone
RUN ln -fs /usr/share/zoneinfo/Europe/Moscow /etc/localtime && dpkg-reconfigure --frontend noninteractive tzdata

# prepare application
WORKDIR /system
COPY --from=build /app/dist ./
RUN rm -f appsettings.*.json

EXPOSE 8080
ENTRYPOINT ["dotnet","ThinkingHome.Console.dll"]
