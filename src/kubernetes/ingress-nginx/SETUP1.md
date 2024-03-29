https://stackoverflow.com/questions/61430311/exposing-multiple-tcp-udp-services-using-a-single-loadbalancer-on-k8s

```sh
kubectl edit deployments -n kube-system ingress-nginx-controller
```

We have to **add** the following lines under spec.template.spec.containers.args:

```yaml
- --tcp-services-configmap=$(POD_NAMESPACE)/tcp-services
- --udp-services-configmap=$(POD_NAMESPACE)/udp-services
```

Create tcp/udp services Config Maps

```yaml
# tcp-services-config-map.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tcp-services
  namespace: ingress-nginx
```

```yaml
# udp-services-config-map.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: udp-services
  namespace: ingress-nginx
```

```sh
kubectl apply -f tcp-services-config-map.yaml
kubectl apply -f udp-services-config-map.yaml

kubectl patch configmap tcp-services -n ingress-nginx --patch '{"data":{"25":"nip05/smtp2http:3000"}}'
```

#### Add ports to NGINX Ingress Controller Deployment

We need to patch our nginx ingress controller so that it is listening on port 25 and can route traffic to your service.

```yaml
spec:
  template:
    spec:
      containers:
        - name: controller
          ports:
            - containerPort: 25
              hostPort: 25
```

```shell
kubectl patch deployment ingress-nginx-controller -n ingress-nginx --patch "$(cat 04-nginx-ingress-controller-patch.yaml)"
```

#### Add ports to NGINX Ingress Controller Service

We have to patch our NGINX Ingress Controller Service as it is the responsible for exposing these ports.

```yaml
spec:
  ports:
    - nodePort: 31100
      port: 25
      name: smtp
```

```shell
kubectl patch service ingress-nginx-controller -n ingress-nginx --patch "$(cat 05-nginx-ingress-svc-controller-patch.yaml)"
```
