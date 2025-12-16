"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRoles = exports.rolePermission = exports.permissions = exports.roles = void 0;
var roles;
(function (roles) {
    roles["admin"] = "admin";
    roles["manager"] = "manager";
    roles["user"] = "user";
    roles["guest"] = "guest";
})(roles || (exports.roles = roles = {}));
var permissions;
(function (permissions) {
    permissions["create_order"] = "create order";
    permissions["update_order"] = "update order";
    permissions["delete_order"] = "delete order";
    permissions["read_order"] = "read order";
    permissions["create_user"] = "create user";
    permissions["update_user"] = "update user";
    permissions["delete_user"] = "delete user";
    permissions["read_user"] = "read user";
    permissions["login"] = "login";
    permissions["logout"] = "logout";
    permissions["read_totalrevenue"] = "read totalrevenue";
    permissions["read_totalrevenuebycategory"] = "read totalrevenuebycategory";
    permissions["read_totalorders"] = "read totalorders";
    permissions["read_totalordersbycategory"] = "read totalordersbycategory";
    permissions["read_pricerangedistribution"] = "read pricerangedistribution";
    permissions["read_AverageOrderValue"] = "read AverageOrderValue";
})(permissions || (exports.permissions = permissions = {}));
exports.rolePermission = {
    [roles.admin]: [
        ...Object.values(permissions)
    ],
    [roles.manager]: [
        permissions.create_order,
        permissions.update_order,
        permissions.delete_order,
        permissions.read_order,
        permissions.read_totalrevenue,
        permissions.read_totalrevenuebycategory,
        permissions.read_totalorders,
        permissions.read_totalordersbycategory,
        permissions.read_pricerangedistribution,
        permissions.read_AverageOrderValue,
        permissions.read_user
    ],
    [roles.user]: [
        permissions.create_order,
        permissions.create_user,
        permissions.update_user,
        permissions.delete_user,
        permissions.update_order,
        permissions.delete_order,
        permissions.login,
        permissions.logout
    ],
    [roles.guest]: [
        permissions.create_user,
        permissions.read_order,
        permissions.login
    ]
};
const toRoles = (role) => {
    switch (role) {
        case roles.admin:
            return roles.admin;
        case roles.manager:
            return roles.manager;
        case roles.user:
            return roles.user;
        case roles.guest:
            return roles.guest;
        default:
            throw new Error('Invalid role');
    }
};
exports.toRoles = toRoles;
//# sourceMappingURL=roles.js.map