const jsSHA = require('jssha');

const SALT = 'idiot';

const getHash = (input) => {
  // create new SHA object
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });

  // create an unhashed cookie string based on user ID and salt
  const unhashedString = `${input}-${SALT}`;

  // generate a hashed cookie string using SHA object
  shaObj.update(unhashedString);

  return shaObj.getHash('HEX');
};
module.exports = {
  up: async (queryInterface) => {
    const userData = [
      {
        email: 'janedoe@gmail.com',
        password: `${getHash('password1')}`,
        username: 'janeD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'johndoe@gmail.com',
        password: `${getHash('password2')}`,
        username: 'johnD',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'justin@gmail.com',
        password: `${getHash('password3')}`,
        username: 'justinW',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'bob@gmail.com',
        password: `${getHash('password4')}`,
        username: 'b0b',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    try {
      const result = await queryInterface.bulkInsert('users', userData);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};