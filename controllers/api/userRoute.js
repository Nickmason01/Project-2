const router = require("express").Router();
const { User } = require("../../models");

router.post('/', async (req, res) => {
  try{
    const userData = await User.create(req.body);
    

  req.session.save(() => {
    req.session.user_id = userData.id;
    req.session.logged_in = true;

    res.status(200), json(userData);
    console.log(req.body)
  });

  }catch (err) {
    res.status(400).json(err)
  }
  
});

router.post('/login', async (req, res) => {
  const userData = await User.findOne({ where: { email: req.body.email } });

  if (!userData) {
    res.status(400).json({ message: "Incorrect email or password!" });
    return;
  }

  const Password = await userData.checkPassword(req.body.password);

  if (!Password) {
    res.status(400).json({ message: "Incorrect email or password!" });
    return;
  }

  // res.session.save(() => {
  //   req.session.user_id = userData.id;
  //   req.session.logged_in = true;

    res.json({user: userData, message: 'Welcome!' });
  });
// });

router.post('/logout', (req, res) => {
  if(req.session.logged_in) {
    req.session.destroy(() =>{
      res.status(204).end();
    });
  }else {
    res.status(404).end();
  }
});


module.exports = router;