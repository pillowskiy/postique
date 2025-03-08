// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.4
// 	protoc        v5.28.2
// source: v1/sso/permission.proto

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

type HasPermissionRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Name          string                 `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *HasPermissionRequest) Reset() {
	*x = HasPermissionRequest{}
	mi := &file_v1_sso_permission_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *HasPermissionRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*HasPermissionRequest) ProtoMessage() {}

func (x *HasPermissionRequest) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_permission_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use HasPermissionRequest.ProtoReflect.Descriptor instead.
func (*HasPermissionRequest) Descriptor() ([]byte, []int) {
	return file_v1_sso_permission_proto_rawDescGZIP(), []int{0}
}

func (x *HasPermissionRequest) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type HasPermissionResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	HasPermission bool                   `protobuf:"varint,1,opt,name=hasPermission,proto3" json:"hasPermission,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *HasPermissionResponse) Reset() {
	*x = HasPermissionResponse{}
	mi := &file_v1_sso_permission_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *HasPermissionResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*HasPermissionResponse) ProtoMessage() {}

func (x *HasPermissionResponse) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_permission_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use HasPermissionResponse.ProtoReflect.Descriptor instead.
func (*HasPermissionResponse) Descriptor() ([]byte, []int) {
	return file_v1_sso_permission_proto_rawDescGZIP(), []int{1}
}

func (x *HasPermissionResponse) GetHasPermission() bool {
	if x != nil {
		return x.HasPermission
	}
	return false
}

type HasUserPermissionRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	UserId        string                 `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	Name          string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *HasUserPermissionRequest) Reset() {
	*x = HasUserPermissionRequest{}
	mi := &file_v1_sso_permission_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *HasUserPermissionRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*HasUserPermissionRequest) ProtoMessage() {}

func (x *HasUserPermissionRequest) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_permission_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use HasUserPermissionRequest.ProtoReflect.Descriptor instead.
func (*HasUserPermissionRequest) Descriptor() ([]byte, []int) {
	return file_v1_sso_permission_proto_rawDescGZIP(), []int{2}
}

func (x *HasUserPermissionRequest) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *HasUserPermissionRequest) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type HasUserPermissionResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	HasPermission bool                   `protobuf:"varint,1,opt,name=hasPermission,proto3" json:"hasPermission,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *HasUserPermissionResponse) Reset() {
	*x = HasUserPermissionResponse{}
	mi := &file_v1_sso_permission_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *HasUserPermissionResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*HasUserPermissionResponse) ProtoMessage() {}

func (x *HasUserPermissionResponse) ProtoReflect() protoreflect.Message {
	mi := &file_v1_sso_permission_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use HasUserPermissionResponse.ProtoReflect.Descriptor instead.
func (*HasUserPermissionResponse) Descriptor() ([]byte, []int) {
	return file_v1_sso_permission_proto_rawDescGZIP(), []int{3}
}

func (x *HasUserPermissionResponse) GetHasPermission() bool {
	if x != nil {
		return x.HasPermission
	}
	return false
}

var File_v1_sso_permission_proto protoreflect.FileDescriptor

var file_v1_sso_permission_proto_rawDesc = string([]byte{
	0x0a, 0x17, 0x76, 0x31, 0x2f, 0x73, 0x73, 0x6f, 0x2f, 0x70, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73,
	0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0e, 0x73, 0x73, 0x6f, 0x2e, 0x70,
	0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x2a, 0x0a, 0x14, 0x48, 0x61, 0x73,
	0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x3d, 0x0a, 0x15, 0x48, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d,
	0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x24,
	0x0a, 0x0d, 0x68, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x08, 0x52, 0x0d, 0x68, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73,
	0x73, 0x69, 0x6f, 0x6e, 0x22, 0x47, 0x0a, 0x18, 0x48, 0x61, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50,
	0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x12, 0x17, 0x0a, 0x07, 0x75, 0x73, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x06, 0x75, 0x73, 0x65, 0x72, 0x49, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d,
	0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x41, 0x0a,
	0x19, 0x48, 0x61, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69,
	0x6f, 0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x24, 0x0a, 0x0d, 0x68, 0x61,
	0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x08, 0x52, 0x0d, 0x68, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e,
	0x32, 0xd4, 0x01, 0x0a, 0x0a, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x12,
	0x5c, 0x0a, 0x0d, 0x48, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e,
	0x12, 0x24, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x70, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f,
	0x6e, 0x2e, 0x48, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x25, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x70, 0x65, 0x72,
	0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x2e, 0x48, 0x61, 0x73, 0x50, 0x65, 0x72, 0x6d, 0x69,
	0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x68, 0x0a,
	0x11, 0x48, 0x61, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69,
	0x6f, 0x6e, 0x12, 0x28, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x70, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73,
	0x69, 0x6f, 0x6e, 0x2e, 0x48, 0x61, 0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x72, 0x6d, 0x69,
	0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x29, 0x2e, 0x73,
	0x73, 0x6f, 0x2e, 0x70, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x2e, 0x48, 0x61,
	0x73, 0x55, 0x73, 0x65, 0x72, 0x50, 0x65, 0x72, 0x6d, 0x69, 0x73, 0x73, 0x69, 0x6f, 0x6e, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x14, 0x5a, 0x12, 0x70, 0x6f, 0x73, 0x74, 0x69,
	0x71, 0x75, 0x65, 0x2e, 0x73, 0x73, 0x6f, 0x2e, 0x76, 0x31, 0x3b, 0x70, 0x62, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
})

var (
	file_v1_sso_permission_proto_rawDescOnce sync.Once
	file_v1_sso_permission_proto_rawDescData []byte
)

func file_v1_sso_permission_proto_rawDescGZIP() []byte {
	file_v1_sso_permission_proto_rawDescOnce.Do(func() {
		file_v1_sso_permission_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_v1_sso_permission_proto_rawDesc), len(file_v1_sso_permission_proto_rawDesc)))
	})
	return file_v1_sso_permission_proto_rawDescData
}

var file_v1_sso_permission_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_v1_sso_permission_proto_goTypes = []any{
	(*HasPermissionRequest)(nil),      // 0: sso.permission.HasPermissionRequest
	(*HasPermissionResponse)(nil),     // 1: sso.permission.HasPermissionResponse
	(*HasUserPermissionRequest)(nil),  // 2: sso.permission.HasUserPermissionRequest
	(*HasUserPermissionResponse)(nil), // 3: sso.permission.HasUserPermissionResponse
}
var file_v1_sso_permission_proto_depIdxs = []int32{
	0, // 0: sso.permission.Permission.HasPermission:input_type -> sso.permission.HasPermissionRequest
	2, // 1: sso.permission.Permission.HasUserPermission:input_type -> sso.permission.HasUserPermissionRequest
	1, // 2: sso.permission.Permission.HasPermission:output_type -> sso.permission.HasPermissionResponse
	3, // 3: sso.permission.Permission.HasUserPermission:output_type -> sso.permission.HasUserPermissionResponse
	2, // [2:4] is the sub-list for method output_type
	0, // [0:2] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_v1_sso_permission_proto_init() }
func file_v1_sso_permission_proto_init() {
	if File_v1_sso_permission_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_v1_sso_permission_proto_rawDesc), len(file_v1_sso_permission_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_v1_sso_permission_proto_goTypes,
		DependencyIndexes: file_v1_sso_permission_proto_depIdxs,
		MessageInfos:      file_v1_sso_permission_proto_msgTypes,
	}.Build()
	File_v1_sso_permission_proto = out.File
	file_v1_sso_permission_proto_goTypes = nil
	file_v1_sso_permission_proto_depIdxs = nil
}
