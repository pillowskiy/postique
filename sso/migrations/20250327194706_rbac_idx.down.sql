ALTER TABLE permissions
DROP CONSTRAINT unique_permissions_name;

DROP INDEX IF EXISTS idx_permissions_name;
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role_id;
DROP INDEX IF EXISTS idx_role_permissions_role_id;
DROP INDEX IF EXISTS idx_role_permissions_permission_id;