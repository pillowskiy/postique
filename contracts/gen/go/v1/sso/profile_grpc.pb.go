// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v5.28.2
// source: v1/sso/profile.proto

package pb

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	Profile_UpdateProfile_FullMethodName = "/sso.profile.Profile/UpdateProfile"
)

// ProfileClient is the client API for Profile service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ProfileClient interface {
	UpdateProfile(ctx context.Context, in *UpdateProfileRequest, opts ...grpc.CallOption) (*UpdateProfileResponse, error)
}

type profileClient struct {
	cc grpc.ClientConnInterface
}

func NewProfileClient(cc grpc.ClientConnInterface) ProfileClient {
	return &profileClient{cc}
}

func (c *profileClient) UpdateProfile(ctx context.Context, in *UpdateProfileRequest, opts ...grpc.CallOption) (*UpdateProfileResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(UpdateProfileResponse)
	err := c.cc.Invoke(ctx, Profile_UpdateProfile_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ProfileServer is the server API for Profile service.
// All implementations must embed UnimplementedProfileServer
// for forward compatibility.
type ProfileServer interface {
	UpdateProfile(context.Context, *UpdateProfileRequest) (*UpdateProfileResponse, error)
	mustEmbedUnimplementedProfileServer()
}

// UnimplementedProfileServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedProfileServer struct{}

func (UnimplementedProfileServer) UpdateProfile(context.Context, *UpdateProfileRequest) (*UpdateProfileResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateProfile not implemented")
}
func (UnimplementedProfileServer) mustEmbedUnimplementedProfileServer() {}
func (UnimplementedProfileServer) testEmbeddedByValue()                 {}

// UnsafeProfileServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ProfileServer will
// result in compilation errors.
type UnsafeProfileServer interface {
	mustEmbedUnimplementedProfileServer()
}

func RegisterProfileServer(s grpc.ServiceRegistrar, srv ProfileServer) {
	// If the following call pancis, it indicates UnimplementedProfileServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&Profile_ServiceDesc, srv)
}

func _Profile_UpdateProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateProfileRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProfileServer).UpdateProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Profile_UpdateProfile_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProfileServer).UpdateProfile(ctx, req.(*UpdateProfileRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Profile_ServiceDesc is the grpc.ServiceDesc for Profile service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Profile_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "sso.profile.Profile",
	HandlerType: (*ProfileServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "UpdateProfile",
			Handler:    _Profile_UpdateProfile_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "v1/sso/profile.proto",
}
