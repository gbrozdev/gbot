const { ObjectId } = require('bson');
var express = require('express');
var router = express.Router();
var db = require('../connection')
const wiki = require('wikijs').default
/* GET home page. */

router.get('/', async function (req, res) {
  let chats = await db.get().collection('chats').find().toArray()
  res.render('index', { chats });
});
router.get('/search', async function (req, res) {
  let chats = await db.get().collection('chats').find().toArray()
  res.render('message', { chats });
});

router.post('/search', async function (req, res) {
  let content = req.body.text
  console.log(content);
  await db.get().collection('chats').createIndex( { text: "text", response: "text" } )
  let chats = await db.get().collection('chats').find(  { $text: { $search: "hlo" } })
  console.log(chats);
  res.render('message', { chats });
});

router.post('/chat-post', async function (req, res) {
  let search = req.body
  let response
 

  switch (search.text) {
    case 'hloo':
      response = 'hay'
      break;
    case 'hay':
      response = 'hlo'
      break;
    case 'your name':
      response = 'gbot'
      break;
    case 'who is he':
      response = search.text.replace('who is','');
      break;
    case 'are you bot?':
      response = 'Yes. Are you mad?'
      break;
    default:
      if(search.text === 'who is maxwell' ){
     var data = search.text.replace('who is','');
      }
      await wiki()
      .page(data)
      .then(page =>

        page
          .chain()
          .summary()
          .image()
          .links()
          .request())
      .then((respon)=>{
          response = respon.extract      
      }); 
  }
  search.response = response
  console.log(search, response);
  db.get().collection('chats').insertOne(search)
  res.redirect('/#new');
});




module.exports = router;
