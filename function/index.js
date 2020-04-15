const request = require("request-promise");

exports.handler = async (event) => {
  try {
    const productId = Number.parseInt(
      event.Records[0].messageAttributes.ProductId.stringValue
    );
    var options = {
      method: "POST",
      uri: "http://api.medicarehardware.tk/reset",
      body: {
        productId: productId,
      },
      headers: {
        "Content-Type": "application/json",
      },
      json: true, // Automatically stringifies the body to JSON
    };
    const res = await request(options);
    return { res };
  } catch (err) {
    return { message: err };
  }
};
