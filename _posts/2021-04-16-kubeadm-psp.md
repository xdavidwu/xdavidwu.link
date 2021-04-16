---
title: "Kubeadm cluster with PodSecurityPolicy"
categories:
  - Kubernetes
tags:
  - kubernetes
  - linux
  - containers
  - en
---

After enabling PodSecurityPolicy admission controller in a kubeadm cluster, one might forget to create policy for mirror pods until finding it out in a hard way when upgrading the cluster.

When creating static pods, kubelet also creates mirror pods on API server. Kubelets are under `system:nodes` group.

Here is a not so strict one that I composed:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: nodes
spec:
  privileged: false
  defaultAllowPrivilegeEscalation: false
  allowedCapabilities: []
  volumes:
    - hostPath
  allowedHostPaths:
    - pathPrefix: /etc
    - pathPrefix: /usr
  forbiddenSysctls:
    - '*'
  hostIPC: false
  hostNetwork: true
  hostPID: false
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  runAsUser:
    rule: 'RunAsAny'
```

I tested it with static pods created by kubeadm, that is, kube-apiserver, kube-controller-manager, kube-scheduler and etcd.

Obiviously this can be futher improved by composing the policy with only what those pods need.

The corresposing ClusterRole and ClusterRoleBinding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp-nodes
rules:
  - apiGroups:
      - policy
    resources:
      - podsecuritypolicies
    verbs:
      - use
    resourceNames:
      - nodes
```

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: psp-nodes
roleRef:
  kind: ClusterRole
  name: psp-nodes
  apiGroup: rbac.authorization.k8s.io
subjects:
  - kind: Group
    name: system:nodes
    apiGroup: rbac.authorization.k8s.io
```
