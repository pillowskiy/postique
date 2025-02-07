module github.com/pillowskiy/postique/sso

go 1.23.4

require (
	github.com/Masterminds/squirrel v1.5.4
	github.com/brianvoe/gofakeit/v7 v7.2.1
	github.com/bufbuild/protovalidate-go v0.9.1
	github.com/golang-jwt/jwt/v5 v5.2.1
	github.com/golang-migrate/migrate/v4 v4.18.2
	github.com/google/uuid v1.6.0
	github.com/ilyakaznacheev/cleanenv v1.5.0
	github.com/jackc/pgx/v5 v5.5.4
	github.com/jmoiron/sqlx v1.4.0
	github.com/pillowskiy/postique/pb v1.0.0
	github.com/pkg/errors v0.9.1
	github.com/stretchr/testify v1.10.0
	golang.org/x/crypto v0.32.0
	google.golang.org/genproto/googleapis/rpc v0.0.0-20250124145028-65684f501c47
	google.golang.org/grpc v1.70.0
	google.golang.org/protobuf v1.36.4
)

replace github.com/pillowskiy/postique/pb => ../contracts/gen/go

require (
	buf.build/gen/go/bufbuild/protovalidate/protocolbuffers/go v1.36.4-20250130201111-63bb56e20495.1 // indirect
	cel.dev/expr v0.19.1 // indirect
	github.com/BurntSushi/toml v1.2.1 // indirect
	github.com/antlr4-go/antlr/v4 v4.13.0 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/google/cel-go v0.23.0 // indirect
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/hashicorp/go-multierror v1.1.1 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/lann/builder v0.0.0-20180802200727-47ae307949d0 // indirect
	github.com/lann/ps v0.0.0-20150810152359-62de8c46ede0 // indirect
	github.com/lib/pq v1.10.9 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/stoewer/go-strcase v1.3.0 // indirect
	go.uber.org/atomic v1.7.0 // indirect
	golang.org/x/exp v0.0.0-20240325151524-a685a6edb6d8 // indirect
	golang.org/x/net v0.34.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	google.golang.org/genproto/googleapis/api v0.0.0-20250127172529-29210b9bc287 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	olympos.io/encoding/edn v0.0.0-20201019073823-d3554ca0b0a3 // indirect
)
