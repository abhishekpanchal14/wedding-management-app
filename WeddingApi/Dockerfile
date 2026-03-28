# Use the official .NET 9.0 runtime image as base
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["WeddingApi.csproj", "."]
RUN dotnet restore "WeddingApi.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "WeddingApi.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "WeddingApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage: copy published app to base image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create directory for SQLite database and uploads
RUN mkdir -p /app/data /app/wwwroot/uploads

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Copy database file if present in build context
COPY wedding.db /app/data/

ENTRYPOINT ["dotnet", "WeddingApi.dll"]