load('ext://restart_process', 'docker_build_with_restart')

### SSO ###

local_resource(
  'sso-compile',
  cmd='CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/sso ./cmd/sso/main.go',
  deps=['./sso/internal'],
  dir='sso'
)

local_resource(
  'file-compile',
  cmd='CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/file-service ./cmd/file/main.go',
  deps=['./file-service/internal'],
  dir='file-service'
)

local_resource(
  'www-generate',
  cmd='npm run dev:prepare',
  deps=['./gateway/views', './gateway/src', './gateway/public'],
  ignore=['./gateway/src/views.d.ts'],
  dir='gateway'
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

docker_build_with_restart(
  'postique/file',
  '.',
  entrypoint=['/app/build/file-service'],
  dockerfile='./infrastructure/dev/docker/file.Dockerfile',
  only=['./file-service/build', './file-service/config', './contracts'],
  live_update=[
    sync('./build', '/app/build'),
    sync('./contracts', '/app/contracts'),
  ],
)

k8s_yaml([
  './infrastructure/dev/k8s/sso.deploy.yml',
  './infrastructure/dev/k8s/file.deploy.yml',
  './infrastructure/dev/k8s/postgres.deploy.yml',
  './infrastructure/dev/k8s/www.deploy.yml',
  './infrastructure/dev/k8s/minio.deploy.yml'
], False)

k8s_resource('postgres', port_forwards='5432:5432')
k8s_resource('minio', port_forwards=[9000, 9090])
k8s_resource('sso', port_forwards=4000, resource_deps=['sso-compile', 'postgres'])
k8s_resource('file', port_forwards=6000, resource_deps=['file-compile', 'minio'])
k8s_resource('www', port_forwards=5001, resource_deps=['www-generate'])
