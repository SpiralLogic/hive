#!/usr/bin/env bash
set -eo pipefail

DIR=$(git rev-parse --show-toplevel)

kubectl apply -f ${DIR}/ops/k8s/cert-manager.yaml
kubectl apply -f ${DIR}/ops/k8s/hive-ingress.yaml
