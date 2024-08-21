#!/bin/bash
ghz \
  --insecure \
  --proto scenarious/protocols/utils/product.proto \
  --call catalog.ProductServiceGrpc/ListAllProducts \
  --total 600 \
  --concurrency 10 \
  --duration 1m \
  localhost:9091