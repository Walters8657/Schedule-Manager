const { checkForPermission, getUserPermission } = require('../permissionCheck.js');
const userDataAccessor = require('../userDataAccessor.js');

const uDA = new userDataAccessor();
const USER_NAME = "test";
const CHILD = "child";
const SYS_OVERSEER = "sysOverseer";

// create test user
console.log("Creating user...");
uDA.createUser(USER_NAME, "test", "test", CHILD, "m", "01/01/1999", [], "TEST", "TEST");

// print true
console.log("Checking for permission " + CHILD + ". Should print true");
console.log(checkForPermission(USER_NAME, CHILD));

// print false
console.log("Checking for permission " + SYS_OVERSEER + ". Should print false");
console.log(checkForPermission(USER_NAME, SYS_OVERSEER));

console.log("Permission Level (Should be " + CHILD + "): " + getUserPermission(USER_NAME));

// delete user
console.log("Cleaning up...");
uDA.deleteUser(USER_NAME);