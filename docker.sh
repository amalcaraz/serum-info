#!/bin/sh

# docker build -t serum-info .

docker run -d -it --rm \
--name serum-info \
-p 8081:80 \
serum-info
