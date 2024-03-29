First, setup the additional load balancer ingress services:

```sh
kubectl apply -f load-balancer-2-unitednostr-com.yaml
kubectl apply -f load-balancer-3-nip05-social.yaml
kubectl apply -f load-balancer-4-nostrid-info.yaml
kubectl apply -f load-balancer-5-nip05-cloud.yaml
kubectl apply -f load-balancer-6-nostrcom-com.yaml
kubectl apply -f load-balancer-7-protonostr-com.yaml
```

You then need to set the reverse DNS record on the automatically created Azure public IP resources. The "name" must be adjusted according to the generated name by Azure.

```sh
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-a32c6c0bc19a040e598c61ae87c87d41 --reverse-fqdn mail.unitednostr.com
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-ac6aa9dc7d99e4aa3b2b2ee40f2d77ba --reverse-fqdn mail.nip05.social
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-ae9d4c5decf8c46da8e3aa665d1bdb1e --reverse-fqdn mail.nostrid.info
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-afe43b6922fa44bb6a907f9ef56b16df --reverse-fqdn mail.nip05.cloud
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-ad223877dca4341e99cc0962533f5c6a --reverse-fqdn mail.nostrcom.com
az network public-ip update --resource-group MC_kubernetes_clucle_eastus --name kubernetes-ace1e129b7e6140e789ea5a7ceae3a4f --reverse-fqdn mail.protonostr.com
```

Also make sure that the DNS records on the domains are correctly setup.
