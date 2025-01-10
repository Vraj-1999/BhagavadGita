require("dotenv").config;

const cloudinary = require("cloudinary").v2;
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const comment = require("./model/comment");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const signs = require("./model/signup");
const mongoose = require("mongoose");
const { requireAuth, currentUser } = require("./middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const app = express();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://vrajpatel479:PatelVraj2710@cluster0.28xnr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0L")
  .then(() => console.log("Db COnnected"))
  .catch((err) => console.log(err));



  cloudinary.config({
    cloud_name: "vrajpatel1999",
    api_key: "436343379635838",
    api_secret: "1ficVzwvJ5SVdsDFBSR2BC7I1Rk",
    secure: true
  });
  
const URLChapters = "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/";

const config = {
  headers: {
    "x-rapidapi-key": "49a50bf44fmshf291ede687ca3d0p1f6ae2jsnb628561e5853",
    "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com",
  },
};

const bhagavadGitaQuotes = [
  "The effort never goes to waste, and there is no failure. Even a little effort toward spiritual awareness will protect you from the greatest fear.",
  "That person, who gives up all material desires and lives free from a sense of greed, proprietorship, and egoism, attains perfect peace.",
  "Make it easy for yourself. Get organized, and live the moment. Your day-to-day activities should not steal your happiness.",
  "Work for work’s sake, not for yourself. Act, but do not be attached to your actions. Be in the world, but not of it.",
  "Arise, slay thy enemies, enjoy a prosperous kingdom.",
  "Renounce your inner dependence on results. And stay unmoved in attention. Actions and results can’t distress you then.",
  "For those who wish to climb the mountain of spiritual awareness, the path is selfless work. For those who have attained the summit of union with the Lord, the path is stillness, peace, and selfless work.",
  "Those who eat too much or eat too little, who sleep too much or sleep too little, will not succeed in meditation. But those who are temperate in eating and sleeping, work and recreation, will come to the end of sorrow through meditation.",
  "Anyone who is steady in his determination for the advanced stage of spiritual realization and can equally tolerate the onslaughts of distress and happiness is certainly a person eligible for liberation.",
  "One has to learn tolerance in the face of dualities such as happiness and stress, warmth and cold and by tolerating such dualities become free from anxieties regarding gain or loss.",
  "Little by little, through patience and repeated effort, you can control your mind.",
  "Meet this transient world with neither grasping nor fear, trust the unfolding of life and you will attain true serenity.",
  "Just hold on to the present-moment attention constantly. All dualities that torment you get destroyed automatically.",
  "Renounce your inner dependence on results. And stay unmoved in attention. Actions and results can’t distress you then.",
  "Left to itself, the mind goes on repeating the same old habitual patterns of personality. By training the mind, however, anyone can learn to step in and change old ways of thinking; that is the central principle of yoga.",
  "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction. Perform work in this world, Arjuna, as a man established within himself – without selfish attachments, and alike in success and defeat. For yoga is perfect evenness of mind.",
  "Seek refuge in the attitude of detachment, and you will amass the wealth of spiritual awareness. Those who are motivated only by the desire for the fruits of action are miserable, for they are constantly anxious about the results of what they do. When consciousness is unified, however, all vain anxiety is left behind. There is no cause for worry, whether things go well or ill.",
  "Acting with kindness and compassion is key to positive thinking.",
  "Do your work with the welfare of others always in mind.",
  "Through selfless service, you will always be fruitful and find the fulfillment of your desires.",
  "If you want to see the brave and bold, look to those who can return love for hatred.",
  "No one who does good work will ever come to a bad end, either here or in the world come.",
  "A gift is pure when it is given from the heart to the right person at the right time and at the right place, and when we expect nothing in return.",
  "Selfish action imprisons the world. Act selflessly, without any thought of personal profit.",
  "They live in wisdom who see themselves in all and all in them.",
  "Whatever action is performed by a great man, common men follow in his footsteps, and whatever standards he sets by exemplary acts, all the world pursues.",
  "That one is dear to me who runs not after the pleasant or away from the painful, grieves not, lusts not, but let things come and go as they happen.",
  "The happiness which comes from long practice, which leads to the end of suffering, which at first is like poison, but at last like nectar – this kind of happiness arises from the serenity of one’s own mind.",
  "The self-controlled soul, who moves amongst sense-objects, free from either attachment or repulsion, wins eternal Peace.",
  "There is only one desire in life which is good and the desire for the means to realize it is also good.",
  "Happiness derived from a combination of the senses and the sense objects is always a cause of distress and should be avoided by all means.",
  "Those established in Self-realization control their senses instead of letting their senses control them.",
  "Free from all thoughts of ‘I’ and ‘mine’, man finds absolute peace.",
  "Pleasures conceived in the world of the senses have a beginning and an end and give birth to misery, Arjuna.",
  "We are like fish out of water; Just as fish cannot be happy unless he is in water; We cannot be happy apart from the spiritual world.",
  "The soul is neither born, and nor does it die.",
  "The spirit is beyond destruction. No one can bring an end to the spirit, which is everlasting.",
  "Fire turns firewood to ash. Self-knowledge turns to ash all actions of dualities on your mind and brings you inner peace.",
  "In the dark night of all beings awake to Light is the tranquil man. But what a day is to other beings is a night for the sage who sees.",
  "One who sees inaction in action, and action in inaction, is intelligent among men.",
  "You are what you believe in. You become that which you believe you can become.",
  "Man is made by his belief. As he believes, so he is.",
  "The Power of God is with you all the time.",
  "And know for certain that Lord Krishna will resolve everything in the end, in a way you would never imagine.",
  "They alone see truly who see the Lord the same in every creature, who see the deathless in the hearts of all those that die. Seeing the same Lord everywhere, they do not harm themselves or others!",
  "He is the source of light in all luminous objects. He is beyond the darkness of matter and is unmanifested. He is knowledge, He is the object of knowledge, and He is the goal of knowledge. He is situated in everyone’s heart.",
  "It is better to live your own destiny imperfectly than to live an imitation of somebody else’s life with perfection. – The Bhagavad Gita",
  "Man is made by his belief. As he believes, so he is. – The Bhagavad Gita",
  "There are three gates to this self-destructive hell: lust, anger, and greed. Renounce these three. – Krishna",
  "Those who cannot renounce attachment to the results of their work are far from the path. – The Gita",
  "A Karma-yogi performs action by body, mind, intellect, and senses, without attachment, only for self-purification. – Bhagavad Gita",
  "Happiness derived from a combination of the senses and the sense objects is always a cause of distress and should be avoided by all means. – The Gita",
  "A gift is pure when it is given from the heart to the right person at the right time and at the right place, and when we expect nothing in return – The Bhagavad Gita",
  "One should strive and employ oneself to uplift oneself. One should never dishonor oneself. The self is one’s friend as well as one’s enemy. – The Bhagavad Gita",
  "As they approach me, so I receive them. All paths, Arjuna, lead to me. – Krishna",
  "Calmness, gentleness, silence, self-restraint, and purity: these are the disciplines of the mind. – The Gita",
  "Always perform your duty efficiently and without attachment to the results, because by doing work without attachment one attains the Supreme. – Bhagavad Gita",
  "The impermanent appearance of happiness and distress and their disappearance in due course are like the appearance and disappearance of winter and summer seasons. They arise from a sense of perception, and one must learn to tolerate them without being disturbed. – The Gita",
  "No one who does good work will ever come to a bad end, either here or in the world to come – The Bhagavad Gita",
  "What the outstanding person does, others will try to do. The standards such people create will be followed by the whole world. – The Bhagavad Gita",
  "I am the beginning, middle, and end of creation. – Krishna",
  "When one’s mind dwells on the objects of Senses, fondness for them grows on him, from fondness comes desire, from desire anger. – The Gita",
  "Even the wise are confused about what is action and what is inaction. – Bhagavad Gita",
  "With the intuitive discrimination, saturated in patience, with the mind absorbed in the soul, the Yogi, feeing his mind, all thoughts, will by slow degrees attain tranquillity. – The Gita",
  "Curving back within myself I create again and again. – The Bhagavad Gita",
  "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place. – The Bhagavad Gita",
  "Just remember that I am, and that I support the entire cosmos with only a fragment of my being. – Krishna",
  "They live in wisdom who see themselves in all and all in them, who have renounced every selfish desire and sense-craving tormenting the heart. – The Gita",
  "On this path effort never goes to waste, and there is no failure. Even a little effort toward spiritual awareness will protect you from the greatest fear. – Bhagavad Gita",
  "A gift is pure when it is given from the heart to the right person, at the right time, at the right place and when we expect nothing in return. – The Gita",
  "The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul. – The Bhagavad Gita",
  "The self-controlled soul, who moves amongst sense objects, free from either attachment or repulsion, he wins eternal Peace. – The Bhagavad Gita",
  "That one is dear to me who runs not after the pleasant or away from the painful, grieves not, lusts not, but lets things come and go as they happen. – Krishna",
  "The offering of wisdom is better than any material offering, Arjuna; for the goal of all work is spiritual wisdom. – The Gita",
  "Sever the ignorant doubt in your heart with the sword of self-knowledge. Observe your discipline. Arise. – Bhagavad Gita",
  "There is neither this world nor the world beyond nor happiness for the one who doubts. – The Gita",
  "Hell has three hates: lust, anger and greed. – The Bhagavad Gita",
  "All created beings are unmanifest in their beginning, manifest in their interim state, and unmanifest again when they are annihilated. So what need is there for lamentation? – The Bhagavad Gita",
  "Just as a reservoir is of little use when the whole countryside is flooded, scriptures are of little use to the illumined man or woman, who sees the Lord everywhere. – Krishna",
  "Even if you were the most sinful of sinners, Arjuna, you could cross beyond all sin by the raft of spiritual wisdom. – The Gita",
  "The deluded ones, who restrain their organs of action but mentally dwell upon the sense enjoyment, are called hypocrites. – Bhagavad Gita",
  "You grieve for those who should not be grieved for, Yet you speak wise words. Neither for the dead nor those alive do the wise grieve for. – The Gita",
  "Set thy heart upon thy work, but never on its reward. – Ved Vyasa, The Bhagavad Gita",
  "When a person is devoted to something with complete faith, I unify his faith in that. Then, when his faith his completely unified, he gains the object of his devotion. – The Bhagavad Gita",
  "Pleasure from the senses seems like nectar at first, but it is bitter as poison in the end. – Krishna",
  "All the scriptures lead to me; I am their author and their wisdom. – The Gita",
  "You should perform your duty with a view to guide people and for universal welfare. – Bhagavad Gita",
  "All happiness in the material world has a beginning and an end, but happiness in Krishna is unlimited, and there is no end. – The Gita",
  "For the senses wander, and when one lets the mind follow them, it carries wisdom away like a windblown ship on the waters. – The Bhagavad Gita",
  "All works are being done by the energy and power of nature, but due to delusion of ego people assume themselves to be the doer. – The Bhagavad Gita",
  "Whatever you do, make it an offering to me – the food you eat, the sacrifices you make, the help you give, even your suffering. – Krishna",
  "The immature think that knowledge and action are different, but the wise see them as the same. – The Gita",
  "Man is made by his belief. As he believes, so he is. – Bhagavad Gita",
  "Some people spread happiness wherever they go, others create happiness wherever they go! – The Gita",
  "We behold what we are, and we are what we behold. – Ved Vyasa, The Bhagavad Gita",
  "There is more happiness in doing one’s own (path) without excellence than in doing another’s (path) well. – The Bhagavad Gita",
  "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction. – Krishna",
  "For the senses wander, and when one lets the mind follow them, it carries wisdom away like a windblown ship on the waters. – The Gita",
  "One who sees inaction in action, and action in inaction, is intelligent among men. – Bhagavad Gita",
  "Those who realize the self are always satisfied. Having found the source of joy and fulfillment, they no longer seek happiness from the external world. Happiness can only be found within the self. – The Gita",
  "The embodied soul is eternal in existence, indestructible, and infinite, only the material body is factually perishable, therefore fight. – The Bhagavad Gita",
  "The actions of a great man are an inspiration for others. Whatever he does becomes a standard for others to follow. – The Bhagavad Gita",
  "The ignorant work for their own profit, Arjuna; the wise work for the welfare of the world, without thought for themselves. – Krishna",
  "The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul. – The Gita",
  "Through selfless service, you will always be fruitful and find the fulfillment of your desires. – Bhagavad Gita",
  "He who has no attachments can love others, For his love is pure and divine. And it is from those small acts of love you truly can be happy. – The Gita",
];

app.get("/", (req, res) => {
  res.render("land.ejs");
});

app.get("/*", currentUser);

app.get("/home", requireAuth, async (req, res) => {
  const user_name = req.body.user_name;
  const user = await signs.findOne({ user_name: user_name });
  console.log(user);

  try {
    const result = await axios.get(URLChapters, config);
    const sec = result.data;

    res.render("home.ejs", { slok: sec });
  } catch (error) {
    res.render("home.ejs", { slok: "error" });
  }
});

app.get("/chapter/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(URLChapters + id);
    const result = await axios.get(URLChapters + id + "/", config);
    const verse = await axios.get(URLChapters + id + "/verses/", config);
    const sec = result.data;
    const versedat = verse.data;

    res.render("chapter.ejs", { chapter: sec, verses: versedat });
  } catch (error) {
    res.render("chapter.ejs", { slok: "error" });
  }
});
app.get("/:chapterNum/verses/:vid", requireAuth, async (req, res) => {
  try {
    const chapNum = req.params.chapterNum;
    const verid = req.params.vid;
    const verse = await axios.get(
      URLChapters + chapNum + "/verses/" + verid + "/",
      config
    );
    const finalVerse = verse.data;

    const Comments = await comment.find();

    res.render("verse.ejs", { verse: finalVerse, COM: Comments });
  } catch (error) {
    res.render("verse.ejs", { slok: "error" });
  }
});

app.post(
  "/:chapterNum/verses/:vid",
  requireAuth,
  currentUser,
  async (req, res) => {
    try {
      const comText = req.body.com;
      const chapNum = req.params.chapterNum;
      const verid = req.params.vid;

      if (comText) {
        const user = req.user;
        const result = await comment.create({
          text_area: comText,
          chapter_num: req.params.chapterNum,
          verse_num: req.params.vid,
          secret_id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          profilePicture: user.profilePicture,
        });

        const verse = await axios.get(
          URLChapters + chapNum + "/verses/" + verid + "/",
          config
        );
        const finalVerse = verse.data;
        const Comments = await comment.find();

        res.render("verse.ejs", {
          verse: finalVerse,
          COM: Comments,
        });
      } else {
        const chapNum = req.params.chapterNum;
        const verid = req.params.vid;
        const verse = await axios.get(
          URLChapters + chapNum + "/verses/" + verid + "/",
          config
        );
        const finalVerse = verse.data;
        res.render("verse.ejs", {
          verse: finalVerse,
        });
      }
    } catch {
      res.render("verse.ejs", { COM: "error" });
    }
  }
);
app.get(
  "/:chapterNum/verses/:verseNum/:commentId/edit",
  requireAuth,
  async (req, res) => {
    try {
      const comentID = req.params.commentId;
      console.log(comentID);
      const chapNum = req.params.chapterNum;
      const verid = req.params.verseNum;

      const verse = await axios.get(
        URLChapters + chapNum + "/verses/" + verid + "/",
        config
      );
      const finalVerse = verse.data;

      const Comments = await comment.find();

      res.render("verse.ejs", { verse: finalVerse, COM: Comments });
    } catch (error) {
      res.render("verse.ejs", { slok: "error" });
    }
  }
);

app.post(
  "/:chapterNum/verses/:verseNum/edit",
  requireAuth,
  currentUser,
  async (req, res) => {
    const { comEdit, commentId } = req.body; // Get the edited comment text and the comment ID
    const chapNum = req.params.chapterNum;
    const verid = req.params.verseNum;

    try {
      if (comEdit && commentId) {
        // Update the comment with the provided ID
        await comment.findByIdAndUpdate(commentId, { text_area: comEdit });

        // Fetch the updated verse and comments
        const verse = await axios.get(
          URLChapters + chapNum + "/verses/" + verid + "/",
          config
        );
        const finalVerse = verse.data;
        const Comments = await comment.find();

        // Render the updated verse with comments
        res.render("verse.ejs", { verse: finalVerse, COM: Comments });
      } else {
        // If no comment was provided or ID missing, render the verse without updating
        const verse = await axios.get(
          URLChapters + chapNum + "/verses/" + verid + "/",
          config
        );
        const finalVerse = verse.data;
        res.render("verse.ejs", { verse: finalVerse });
      }
    } catch (error) {
      console.error(error);
      // Render the error page
      const verse = await axios.get(
        URLChapters + chapNum + "/verses/" + verid + "/",
        config
      );
      const finalVerse = verse.data;
      const Comments = await comment.find();
      res.render("verse.ejs", { verse: finalVerse, COM: Comments });
    }
  }
);

app.get("/signup", async (req, res) => {
  try {
    res.render("signup.ejs");
  } catch (error) {
    res.render("home.ejs", { slok: "error" });
  }
});

app.get("/login", async (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    res.render("login.ejs", { slok: "error" });
  }
});

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "Welcome to spirituality", {
    expiresIn: maxAge,
  });
};

// app.post("/signup", upload.single("profilePicture"), async (req, res) => {
 
//   try {
//     const body = req.body;
//     const username = req.body.user_name;
//     const user = await signs.findOne({ username });

//     if (username != user) {
//       if (
//         body.first_name ||
//         body.last_name ||
//         body.user_name ||
//         body.password
//       ) {
//         const NewUser = await signs.create({
//           first_name: body.first_name,
//           last_name: body.last_name,
//           gender: body.gender,
//           user_name: body.user_name,
//           password: body.password,
//           profilePicture: imageUrl,
//           emailEnabled: true,
//         });

//         console.log("all Users", NewUser);
//         console.log(NewUser.password);
        
//         const token = createToken(NewUser._id);
//         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

//         const AllUsers = await signs.find();
//         console.log("all Users", AllUsers);

//         res.render("signup.ejs", { msg: "Account Created Succesfully" });
//       } else {
//         res.render("signup.ejs", { Msg: "All Field Required" });
//       }
//     } else {
//       res.render("signup.ejs", { Msg: "Username allready used" });
//     }
//   } catch (error) {
//     res.render("signup.ejs", { msg: "error" });
//   }
// });

app.post("/signup", upload.single("profilePicture"), async (req, res) => {
  try {
    const body = req.body;
    const username = req.body.user_name;
    console.log(req.file);
    const user = await signs.findOne({ username });
    if (user) {
      return res.render("signup.ejs", { Msg: "Username already used" });
    }

    if (
      body.first_name &&
      body.last_name &&
      body.user_name &&
      body.password
    ) {
      
      if(req.file){

      cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).send("Error uploading image to Cloudinary");
          }

          const imageUrl = result.secure_url; // Get the image URL after upload
          console.log(imageUrl);

          // Create the new user after the image is uploaded
          const NewUser = await signs.create({
            first_name: body.first_name,
            last_name: body.last_name,
            gender: body.gender,
            user_name: body.user_name,
            password: body.password,
            profilePicture: imageUrl, // Store the Cloudinary URL
            emailEnabled: true,
          });

          console.log("All Users", NewUser);

          // Create token and set cookie
          const token = createToken(NewUser._id);
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

          // Fetch all users and render success message
          const AllUsers = await signs.find();
          console.log("All Users", AllUsers);

          res.render("signup.ejs", { msg: "Account Created Successfully" });
        }
      ).end(req.file.buffer); // This starts the upload and sends the file buffer
    }else{
      const NewUser = await signs.create({
        first_name: body.first_name,
        last_name: body.last_name,
        gender: body.gender,
        user_name: body.user_name,
        password: body.password,
        emailEnabled: true,
      });

      console.log("All Users", NewUser);

      // Create token and set cookie
      const token = createToken(NewUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      // Fetch all users and render success message
      const AllUsers = await signs.find();
      console.log("All Users", AllUsers);

      res.render("signup.ejs", { msg: "Account Created Successfully" });
    }
    } else {
      res.render("signup.ejs", { Msg: "All fields are required" });
    }
  } catch (error) {
    console.error(error);
    res.render("signup.ejs", { msg: "An error occurred" });
  }
});



app.post("/login", async (req, res) => {
  const user_name = req.body.user_name;
  const password = req.body.password;
  try {
    const user = await signs.findOne({ user_name });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect("/home");
      } else {
        res.render("login.ejs", { msg: "Incorrect Password " });
      }
    } else {
      res.render("login.ejs", { msg: "Incorrect Username " });
    }
  } catch (error) {
    res.render("login.ejs", { msg: "error" });
  }
});

// app.post(
//   "/update-profile",
//   requireAuth,
//   currentUser,
//   upload.single("profilePicture"),
//   async (req, res) => {
//     try {
//       const { body, file, user } = req;

//       if (!user) return res.status(401).send("Unauthorized");
      
//       if (body.first_name) {
//         await signs.findByIdAndUpdate(user._id, {
//           first_name: body.first_name,
//         });
//         await comment.findOneAndUpdate(
//           { secret_id: user._id }, // Query to find the document by secret_id
//           { $set: { first_name: body.first_name } } // Update operation
//         );
//       }
//       if (body.last_name) {
//         await signs.findByIdAndUpdate(user._id, { last_name: body.last_name });
//         await comment.findOneAndUpdate(
//           { secret_id: user._id },
//           { $set: { last_name: body.last_name } }
//         );
//       }
//       if (body.gender) {
//         await signs.findByIdAndUpdate(user._id, { gender: body.gender });
//       }
//       if (body.user_name) {
//         await signs.findByIdAndUpdate(user._id, { user_name: body.user_name });
//       }

//       if (body.password) {
//         const salt = await bcrypt.genSalt(); // Adjust salt rounds if needed
//         const hashedPassword = await bcrypt.hash(body.password, salt);
//         await signs.findByIdAndUpdate(user._id, { password: hashedPassword });
//       }
//       if (file?.filename) {
//         await signs.findByIdAndUpdate(user._id, {
//           profilePicture: file.filename,
//         });

//         await comment.findOneAndUpdate(
//           { secret_id: user._id }, // Query to find the document by secret_id
//           { $set: { profilePicture: file.filename } } // Update operation
//         );
//       }

//       const token = createToken(user._id);
//       res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

//       console.log("Profile updated successfully");
//       res.redirect("/users");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       res.status(500).send("An error occurred");
//     }
//   }
// );


app.post(
  "/update-profile",
  requireAuth,
  currentUser,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { body, file, user } = req;

      if (!user) return res.status(401).send("Unauthorized");

      // 1. Update fields like first_name, last_name, gender, etc.
      if (body.first_name) {
        await signs.findByIdAndUpdate(user._id, {
          first_name: body.first_name,
        });
        await comment.findOneAndUpdate(
          { secret_id: user._id }, // Query to find the document by secret_id
          { $set: { first_name: body.first_name } }
        );
      }

      if (body.last_name) {
        await signs.findByIdAndUpdate(user._id, { last_name: body.last_name });
        await comment.findOneAndUpdate(
          { secret_id: user._id },
          { $set: { last_name: body.last_name } }
        );
      }

      if (body.gender) {
        await signs.findByIdAndUpdate(user._id, { gender: body.gender });
      }

      if (body.user_name) {
        await signs.findByIdAndUpdate(user._id, { user_name: body.user_name });
      }

      if (body.password) {
        const salt = await bcrypt.genSalt(); // Adjust salt rounds if needed
        const hashedPassword = await bcrypt.hash(body.password, salt);
        await signs.findByIdAndUpdate(user._id, { password: hashedPassword });
      }

      // 2. Upload image to Cloudinary if a file is uploaded
      let imageUrl = user.profilePicture; // Keep the existing image URL if no new image is uploaded
      if (file?.buffer) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                return reject("Error uploading image to Cloudinary");
              }
              resolve(result);
            }
          ).end(file.buffer); // Send the image buffer to Cloudinary
        });

        imageUrl = result.secure_url; // Get the Cloudinary URL of the uploaded image
        // Update user profile picture with the new Cloudinary URL
        await signs.findByIdAndUpdate(user._id, {
          profilePicture: imageUrl,
        });

        await comment.findOneAndUpdate(
          { secret_id: user._id }, // Query to find the document by secret_id
          { $set: { profilePicture: imageUrl } } // Update comment collection as well
        );
      }

      // 3. Generate a new JWT token after profile update
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      console.log("Profile updated successfully");
      res.redirect("/users");
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("An error occurred");
    }
  }
);

app.get(
  "/:chapterNum/verses/:verseNum/:commentId",
  requireAuth,
  async (req, res) => {
    const chapterNum = req.params.chapterNum;
    const verseNum = req.params.verseNum;
    const commentId = req.params.commentId;

    try {
      // console.log(chapterNum, verseNum, commentId);

      const verse = await axios.get(
        URLChapters + chapterNum + "/verses/" + verseNum + "/",
        config
      );

      const finalVerse = verse.data;
      const del = await comment.findByIdAndDelete(commentId);
      console.log(del);

      const Comments = await comment.find();

      res.render("verse.ejs", {
        verse: finalVerse,
        COM: Comments,
      });
    } catch (error) {
      const verse = await axios.get(
        URLChapters + chapterNum + "/verses/" + verseNum + "/",
        config
      );
      const finalVerse = verse.data;

      const Comments = await comment.find();
      res.render("verse.ejs", {
        verse: finalVerse,
        COM: Comments,
      });
    }
  }
);

app.get("/users", async (req, res) => {
  res.render("user.ejs");
});

app.get("/logout", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

app.get("/quote", async (req, res) => {
  const email = req.user.user_name;
  const user = await signs.findOne({});
  console.log(user.emailEnabled);
  const quote =
    bhagavadGitaQuotes[Math.floor(Math.random() * bhagavadGitaQuotes.length)];

  if (user.emailEnabled) {
    res.render("quote.ejs", { SlokLine: quote, button: "Stop" });
  } else {
    res.render("quote.ejs", { SlokLine: quote, button: "Start" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhagwatgeeta337@gmail.com",
    pass: "ihyf tkya nkyh mbzy",
  },
});

const sendEmail = (email) => {
  console.log("Attempting to send email to:", email);

  const mailOptions = {
    from: "bhagwatgeeta337@gmail.com",
    to: email,
    subject: "Good Morning! Have a Great Day!!",
    text: bhagavadGitaQuotes[
      Math.floor(Math.random() * bhagavadGitaQuotes.length)
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
cron.schedule("32 14 * * *", async () => {
  const users = await signs.find({ emailEnabled: true });

  users.forEach((user) => {
    sendEmail(user.user_name);
    console.log(user.user_name);
  });

  console.log("Emails sent to all registered users at 9:00 AM every day!");
});

app.post("/Stop", requireAuth, currentUser, async (req, res) => {
  const email = req.user.user_name;
  const user = await signs.findOne({ user_name: email });
  console.log(user.emailEnabled);
  const quote =
    bhagavadGitaQuotes[Math.floor(Math.random() * bhagavadGitaQuotes.length)];

  if (user) {
    user.emailEnabled = false;
    await user.save();
    res.render("quote.ejs", {
      SlokLine: quote,
      button: "Start",
      start:
        "Currently You are will not receiving daily Quote through Email. if you want to change that use the toggle button above .",
    });
  } else {
    res.render("quote.ejs", { SlokLine: quote });
  }
});

app.post("/Start", requireAuth, currentUser, async (req, res) => {
  const email = req.user.user_name;
  const user = await signs.findOne({ user_name: email });
  console.log(user.emailEnabled);
  const quote =
    bhagavadGitaQuotes[Math.floor(Math.random() * bhagavadGitaQuotes.length)];

  if (user) {
    user.emailEnabled = true;
    await user.save();
    res.render("quote.ejs", {
      SlokLine: quote,
      button: "Stop",
      stop: "Currently You are receiving daily Quote through Email. if you want to change that use the toggle button above .",
    });
  } else {
    res.render("quote.ejs", { SlokLine: quote });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
