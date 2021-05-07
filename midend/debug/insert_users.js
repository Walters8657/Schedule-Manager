const { hashPassword } = require('./../passwordGeneration.js');
const userDataAccessor = require('./../userDataAccessor.js');

const u = new userDataAccessor();
const saltHash = hashPassword('password');

try {
    u.createUser('testChild', 'test', 'child', 'child', 'o', '04/20/1969', [], saltHash.salt, saltHash.hash);
    u.createUser('testLowStaff', 'test', 'low', 'lowStaff', 'o', '04/20/1969', [], saltHash.salt, saltHash.hash);
    u.createUser('testUpperStaff', 'test', 'upper', 'upStaff', 'o', '04/20/1969', [], saltHash.salt, saltHash.hash);
    u.createUser('testOverseer', 'test', 'overseer', 'sysOverseer', 'o', '04/20/1969', [], saltHash.salt, saltHash.hash);

    console.log('Inserted all four types of users.');
} catch(e) {
    console.log('Error creating users!');
}
