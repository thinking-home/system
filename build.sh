docker pull microsoft/dotnet:2.0.0-runtime

dotnet publish -c Release -o bin/publish

docker build -t dima117a/thinking-home:4.0.0-alpha3 .