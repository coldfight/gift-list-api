const faker = require("faker");
const sequelize = require("./libs/database");
const registerModelAssociations = require("./libs/registerModelAssociations");

const Gift = require("./models/gift");
const Recipient = require("./models/recipient");
const User = require("./models/user");

// ssh pi@192.168.2.45 -p 22022 -L 3306:127.0.0.1:3306 -N
sequelize
  .sync({ force: true })
  .then(() => {
    return User.create({
      username: "coldfight",
      password: "password"
    });
  })
  .then(user => {
    return Promise.all([
      Recipient.create({ name: "Brother In Law", userId: user.id }),
      Recipient.create({ name: "Sister", userId: user.id }),
      Recipient.create({ name: "Mom", userId: user.id }),
      Recipient.create({ name: "Dad", userId: user.id }),
      Recipient.create({ name: "Girlfriend", userId: user.id })
    ]);
  })
  .then(recipients => {
    const promises = [];
    for (let recipient of recipients) {
      let numGifts = faker.random.number({ min: 1, max: 3 });
      for (let i = 0; i < numGifts; i++) {
        promises.push(
          recipient.createGift({
            name: faker.commerce.productName(),
            price: faker.random.number({ min: 15, max: 100 }),
            userId: recipient.userId
          })
        );
      }
    }
    return Promise.all(promises);
  })
  .then(gifts => {
    sequelize.close();
  })
  .catch(err => {
    console.log("Handled error: ");
    console.log(err);
    sequelize.close();
  });
