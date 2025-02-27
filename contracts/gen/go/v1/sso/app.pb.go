// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.4
// 	protoc        v5.28.2
// source: v1/sso/app.proto

package pb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type CreateAppRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Name          string                 `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateAppRequest) Reset() {
	*x = CreateAppRequest{}
	mi := &file_v1_sso_app_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateAppRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateAppRequest) ProtoMessage() {}

func (x *CreateAppRequest) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_app_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateAppRequest.ProtoReflect.Descriptor instead.
func (*CreateAppRequest) Descriptor() ([]byte, []int) {
	return file_v1_sso_app_proto_rawDescGZIP(), []int{0}
}

func (x *CreateAppRequest) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type CreateAppResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	AppId         string                 `protobuf:"bytes,1,opt,name=app_id,json=appId,proto3" json:"app_id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateAppResponse) Reset() {
	*x = CreateAppResponse{}
	mi := &file_v1_sso_app_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateAppResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateAppResponse) ProtoMessage() {}

func (x *CreateAppResponse) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_app_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateAppResponse.ProtoReflect.Descriptor instead.
func (*CreateAppResponse) Descriptor() ([]byte, []int) {
	return file_v1_sso_app_proto_rawDescGZIP(), []int{1}
}

func (x *CreateAppResponse) GetAppId() string {
	if x != nil {
		return x.AppId
	}
	return ""
}

var File_v1_sso_app_proto protoreflect.FileDescriptor

var file_v1_sso_app_proto_rawDesc = string([]byte{
	0x0a, 0x10, 0x76, 0x31, 0x2f, 0x73, 0x73, 0x6f, 0x2f, 0x61, 0x70, 0x70, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x07, 0x73, 0x73, 0x6f, 0x2e, 0x61, 0x70, 0x70, 0x22, 0x26, 0x0a, 0x10, 0x43,
	0x72, 0x65, 0x61, 0x74, 0x65, 0x41, 0x70, 0x70, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e,
	0x61, 0x6d, 0x65, 0x22, 0x2a, 0x0a, 0x11, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x41, 0x70, 0x70,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x15, 0x0a, 0x06, 0x61, 0x70, 0x70, 0x5f,
	0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x61, 0x70, 0x70, 0x49, 0x64, 0x32,
	0x49, 0x0a, 0x03, 0x41, 0x70, 0x70, 0x12, 0x42, 0x0a, 0x09, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65,
	0x41, 0x70, 0x70, 0x12, 0x19, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x43, 0x72,
	0x65, 0x61, 0x74, 0x65, 0x41, 0x70, 0x70, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x1a,
	0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x61, 0x70, 0x70, 0x2e, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x41,
	0x70, 0x70, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x14, 0x5a, 0x12, 0x70, 0x6f,
	0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x76, 0x31, 0x3b, 0x70, 0x62,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
})

var (
	file_v1_sso_app_proto_rawDescOnce sync.Once
	file_v1_sso_app_proto_rawDescData []byte
)

func file_v1_sso_app_proto_rawDescGZIP() []byte {
	file_v1_sso_app_proto_rawDescOnce.Do(func() {
		file_v1_sso_app_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_v1_sso_app_proto_rawDesc), len(file_v1_sso_app_proto_rawDesc)))
	})
	return file_v1_sso_app_proto_rawDescData
}

var file_v1_sso_app_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_v1_sso_app_proto_goTypes = []any{
	(*CreateAppRequest)(nil),  // 0: sso.app.CreateAppRequest
	(*CreateAppResponse)(nil), // 1: sso.app.CreateAppResponse
}
var file_v1_sso_app_proto_depIdxs = []int32{
	0, // 0: sso.app.App.CreateApp:input_type -> sso.app.CreateAppRequest
	1, // 1: sso.app.App.CreateApp:output_type -> sso.app.CreateAppResponse
	1, // [1:2] is the sub-list for method output_type
	0, // [0:1] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_v1_sso_app_proto_init() }
func file_v1_sso_app_proto_init() {
	if File_v1_sso_app_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_v1_sso_app_proto_rawDesc), len(file_v1_sso_app_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_v1_sso_app_proto_goTypes,
		DependencyIndexes: file_v1_sso_app_proto_depIdxs,
		MessageInfos:      file_v1_sso_app_proto_msgTypes,
	}.Build()
	File_v1_sso_app_proto = out.File
	file_v1_sso_app_proto_goTypes = nil
	file_v1_sso_app_proto_depIdxs = nil
}
