const { hashPassword } = require('./../midend/passwordGeneration.js');
const userDataAccessor = require('./../midend/userDataAccessor.js');

var cmdArgs = process.argv.slice(2);

if ((cmdArgs[0] != "") && (cmdArgs[1] != "")) {
  const u = new userDataAccessor();
  const saltHash = hashPassword(cmdArgs[1]);

  try {
      u.createUser(cmdArgs[0], 'Temporary', 'Overseer', 'sysOverseer', 'o', '', [], saltHash.salt, saltHash.hash);
      console.log('Inserted overseer: ' + cmdArgs[0]);

  } catch(e) {
      console.log('Error creating users!');
  }
}
else {
  console.log('Please run this script in the form:');
  console.log('\nnode insert_overseer.js YourUsername YourPassword\n');
}
