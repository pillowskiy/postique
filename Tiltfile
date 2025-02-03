load('ext://restart_process', 'docker_build_with_restart')

### SSO ###

local_resource(
  'sso-compile',
  cmd='CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/sso ./cmd/sso/main.go',
  deps=['./sso/internal'],
  dir='sso'
)

docker_build_with_restart(
  'postique/sso',
  '.',
  entrypoint=['/app/build/sso'],
  dockerfile='./infrastructure/dev/docker/sso.Dockerfile',
  only=['./sso/build', './sso/config', './contracts'],
  live_update=[
    sync('./build', '/app/build'),
    sync('./contracts', '/app/contracts'),
  ],
)

k8s_yaml('./infrastructure/dev/k8s/sso.deploy.yml')
k8s_resource('sso', port_forwards=4000, resource_deps=['sso-compile'])