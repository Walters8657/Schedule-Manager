const userDataAccessor = require('./../userDataAccessor.js');

const u = new userDataAccessor()

// Delete the testChild

try {
    u.deleteUser("testChild");
    console.log('Deleted testChild');
} catch(e) {
    console.log('testChild does not exist');
}

// Delete the testLowStaff
try {
    u.deleteUser("testLowStaff");
    console.log('Deleted testLowStaff');
} catch(e) {
    console.log('testLowStaff does not exist');
}

// Delete the testUpperStaff
try {
    u.deleteUser("testUpperStaff");
    console.log('Deleted testUpperStaff');
} catch(e) {
    console.log('testUpperStaff does not exist');
}

// Delete the testOverseer
try {
    u.deleteUser("testOverseer");
    console.log('Deleted testOverseer');
} catch(e) {
    console.log('testOverseer does not exist');
}
