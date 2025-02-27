module github.com/pillowskiy/postique/files

go 1.23.4

require (
	github.com/aws/aws-sdk-go v1.55.6
	github.com/golang-jwt/jwt/v5 v5.2.1
	github.com/ilyakaznacheev/cleanenv v1.5.0
	github.com/pillowskiy/postique/pb v1.0.0
	google.golang.org/grpc v1.70.0
)

replace github.com/pillowskiy/postique/pb => ../contracts/gen/go

require (
	github.com/BurntSushi/toml v1.2.1 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	golang.org/x/net v0.32.0 // indirect
	golang.org/x/sys v0.28.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20241202173237-19429a94021a // indirect
	google.golang.org/protobuf v1.36.4 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	olympos.io/encoding/edn v0.0.0-20201019073823-d3554ca0b0a3 // indirect
)
