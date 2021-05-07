const userDataAccessor = require('./userDataAccessor.js');

const possible_permissions = ['child', 'lowStaff', 'upStaff', 'sysOverseer'];

function checkForPermission(userName, permission) {
    const uDA = new userDataAccessor();
    const userData = JSON.parse(uDA.getUser(userName)).data;

    userPermissionLevel = possible_permissions.indexOf(userData.permission);
    checkPermissionLevel = possible_permissions.indexOf(permission);

    return userPermissionLevel >= checkPermissionLevel;
}

function getUserPermission(userName) {
    const uDA = new userDataAccessor();
    const userData = JSON.parse(uDA.getUser(userName)).data;

    return userData.permission;
}

module.exports = {checkForPermission, getUserPermission, possible_permissions};