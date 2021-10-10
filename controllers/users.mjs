import jsSHA from 'jssha';

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
export default function initUsersController(db) {
  const index = async (req, res) => {
    res.render('login')
  }
  const register = async (req, res) => {
    console.log(req.body)
    try {
      const findExistingEmail = await db.User.findOne({
        where: {
          email: req.body.registerEmail,
        },
      });
      console.log(findExistingEmail)
      if (findExistingEmail !== null) {
        res.send('emailExists');
      }
      else {
        const hashedPassword = getHash(req.body.password);
        const newUser = await db.User.create({
          email: req.body.registerEmail,
          username: req.body.username,
          password: hashedPassword,
        });
        res.cookie('loggedIn', hashedPassword);
        res.cookie('id', newUser.id);
        res.redirect('lobby');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (req, res) => {
    try {
      console.log(req.body);
      const hashedPassword = getHash(req.body.password);
      const findExistingUser = await db.User.findOne({
        where: {
          email: req.body.loginEmail,
          password: hashedPassword,
        },
      });
      if (findExistingUser === null) {
        res.send('invalidLogin');
      }
      else {
        res.cookie('loggedIn', hashedPassword);
        res.cookie('id', findExistingUser.id);
        res.redirect('lobby');
      }
    }
    catch (error) {
      res.send(error);
    }
  };
  const getLobby = async (req, res) => {
    try {
      res.render('lobby')
    }
    catch (error) {
      res.send(error);
    }
  }
  const getPlayers = async (req, res) => {
    try{
      const currentPlayerID = req.cookies.id
      const allPlayers = await db.User.findAll()
      for (let i = 0; i < allPlayers.length; i += 1) {
        console.log(allPlayers[i].id)
        if (allPlayers[i].id === Number(currentPlayerID)) {
          allPlayers.splice(i, 1)
        }
      }
      res.send(allPlayers)
    }
    catch (error) {
      res.send(error);
    }
  }
  const checkCookies = async (req, res) => {
    try {
      if (req.cookies.loggedIn === undefined) {
        res.redirect('login')
      }
      else {
        const cookieQuery = await db.User.findOne({
          where: {
            password: req.cookies.loggedIn,
          },
        });
        if (cookieQuery === null) {
          res.redirect('login')
        }
        else {
          res.send('render')
        }
      }
    }
    catch (error) {
      res.send(error);
    }
  };
  return {
    register,
    login,
    checkCookies,
    index,
    getLobby,
    getPlayers
  };
}
