#!/usr/bin/env bash
set -eo pipefail
kubectl apply -f ops/k8s/cert-manager.yaml
kubectl apply -f ops/k8s/ingress.yaml



