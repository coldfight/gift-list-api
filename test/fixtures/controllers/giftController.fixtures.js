const User = require("../../../models/user");

exports.set1 = async () => {
  const [user1, user2] = await Promise.all([
    User.create({
      id: 1,
      username: "coldfight",
      password: "thisismypassword"
    }),
    User.create({
      id: 2,
      username: "amedeo",
      password: "thisismypassword"
    })
  ]);

  const [recipient1, recipient2] = await Promise.all([
    user1.createRecipient({
      name: "Recipient A"
    }),
    user2.createRecipient({
      name: "Recipient B"
    })
  ]);

  const [gift1, gift2, gift3, gift4] = await Promise.all([
    user1.createGift({
      id: 1,
      name: "Gift A",
      price: 100,
      bought: false,
      recipientId: recipient1.id
    }),
    user1.createGift({
      id: 2,
      name: "Gift B",
      price: 100,
      bought: false,
      recipientId: recipient1.id
    }),
    user2.createGift({
      id: 3,
      name: "Gift C",
      price: 100,
      bought: false,
      recipientId: recipient2.id
    }),
    user2.createGift({
      id: 4,
      name: "Gift D",
      price: 100,
      bought: false,
      recipientId: recipient2.id
    })
  ]);
  return { user1, user2, recipient1, recipient2, gift1, gift2, gift3, gift4 };
};
