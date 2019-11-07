const faker = require("faker");
const sequelize = require("./libs/database");
const registerModelAssociations = require("./libs/registerModelAssociations");

const Gift = require("./models/gift");
const Recipient = require("./models/recipient");

// ssh pi@192.168.2.45 -p 22022 -L 3306:127.0.0.1:3306 -N
sequelize
  .sync({ force: true })
  .then(() => {
    return Promise.all([
      Recipient.create({ name: "Brother In Law" }),
      Recipient.create({ name: "Sister" }),
      Recipient.create({ name: "Mom" }),
      Recipient.create({ name: "Dad" }),
      Recipient.create({ name: "Girlfriend" })
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
            price: faker.random.number({ min: 15, max: 100 })
          })
        );
      }
    }
    return Promise.all(promises);
  })
  .then(gifts => {
    sequelize.close();
  });
