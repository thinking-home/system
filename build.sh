docker pull microsoft/dotnet:2.0-runtime

dotnet publish -c Release -o publish

docker build -t system:4.0.0-alpha2 .