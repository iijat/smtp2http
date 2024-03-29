docker build -t smtp2http-image:latest .

docker tag smtp2http-image:latest iijat.azurecr.io/smtp2http:latest

az acr login --name iijat

docker push iijat.azurecr.io/smtp2http:latest
