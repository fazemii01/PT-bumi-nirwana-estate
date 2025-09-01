# fix-docker.ps1
Write-Host "Checking Docker CLI environment..."

# Kalau DOCKER_HOST diarahkan ke WSL2 socket atau kosong
if ($Env:DOCKER_HOST -eq "npipe:////./pipe/dockerDesktopLinuxEngine" -or -not $Env:DOCKER_HOST) {
    Write-Host "Docker CLI is pointing to Linux Engine (WSL2) or unset."
    Write-Host "Switching to Hyper-V socket (docker_engine)..."
    $Env:DOCKER_HOST = "npipe:////./pipe/docker_engine"
}

Write-Host "Current DOCKER_HOST: $Env:DOCKER_HOST"

# Test koneksi
Write-Host "Running: docker ps..."
docker ps
