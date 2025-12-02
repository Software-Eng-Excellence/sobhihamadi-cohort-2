

export enum roles{
    admin="admin",
    manager="manager",
    user="user",
    guest="guest"
}

export enum permissions {
    create_order="create order",
    update_order="update order",
    delete_order="delete order",
    read_order="read order",
    create_user="create user",
    update_user="update user",
    delete_user="delete user",
    read_user="read user",
    login="login",
    logout="logout",
    read_totalrevenue="read totalrevenue",
    read_totalrevenuebycategory="read totalrevenuebycategory",
    read_totalorders="read totalorders",
    read_totalordersbycategory="read totalordersbycategory",
    read_pricerangedistribution="read pricerangedistribution",
    read_AverageOrderValue="read AverageOrderValue"
}

export type rolesPermissions={
    [key in roles]:permissions[]
}

export const rolePermission:rolesPermissions={
    [roles.admin]:[
        ...Object.values(permissions)
    ],
    [roles.manager]:[
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
    [roles.user]:[
        permissions.create_order,
        permissions.create_user,
        permissions.update_user,
        permissions.delete_user,
        permissions.update_order,
        permissions.delete_order,
        permissions.login,
        permissions.logout
    ],
    [roles.guest]:[
        permissions.create_user,
        permissions.read_order,
        permissions.login
    ]

}

export const toRoles=(role:string):roles=>{
    switch(role){
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
}
