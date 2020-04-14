$(document).ready(() => {
  fetch("http://api.medicarehardware.tk/products")
    .then((res) => {
      return res.json();
    })
    .then((body) => {
      const productsDiv = $("#products");
      productsDiv.empty();
      let tr;
      let totalCost = 0;
      for (const product of body.products) {
        tr = document.createElement("tr");
        tr.innerHTML += `
                    <tr>
                        <td class="col-md-6">
                            <div class="media">
                                <a class="thumbnail pull-left"> <img
                                        class="media-object"
                                        src="/assets/img/${product.code}.png"
                                        style="width: 72px; height: 72px;"> </a>
                                <div class="media-body">
                                    <h4 class="media-heading"><a id="item${
                                      product.id
                                    }name">${product.name}</a></h4>
                                    <h5 class="media-heading"> by <a>${
                                      product.provider
                                    }</a></h5>
                                    <span>Status: </span><span
                                        class="${
                                          product.status === "Available"
                                            ? "text-success"
                                            : "text-warning"
                                        }"><strong>${
          product.status
        }</strong></span>
                                </div>
                            </div>
                        </td>
                        <td class="col-md-1" style="text-align: center">
                            <input type="text" class="form-control orderInput"
                                id="item${product.id}val" min=0 value="0" max=${
          product.unitsAvailable
        }>
                        </td>
                        <td class="col-md-1 text-center"><strong id="item${
                          product.id
                        }price">$${product.pricePerUnit.toFixed(
          2
        )}</strong></td>
                        <td class="col-md-1 text-center"><strong class="orderInput" id="item${
                          product.id
                        }">$0.00</strong></td>
                    </tr>
                `;
        totalCost += product.pricePerUnit * 2;
        productsDiv.append(tr);
      }

      $(".orderInput").keyup((event) => {
        const id = event.currentTarget.id;
        const value = Number.parseInt(event.currentTarget.value);
        const priceRaw = $("#" + id.substr(0, id.length - 3) + "price")
          .html()
          .substr(1, 10000);
        const price = Number.parseFloat(priceRaw);

        $("#" + id.substr(0, id.length - 3)).html(
          "$" + (value * price).toFixed(2)
        );

        val = [];
        pricesArr = [];
        $('[id^="item"][id$="val"]').each((_, el) => {
          val.push(Number.parseInt(el.value));
        });
        $('[id^="item"][id$="price"]').each((_, el) => {
          pricesArr.push(
            Number.parseFloat(el.innerHTML.substr(1, el.innerHTML.length))
          );
        });

        totalCost = 0;
        for (let i = 0; i < val.length; i++) {
          totalCost += val[i] * pricesArr[i];
        }

        $("#subTotal").html("$" + totalCost.toFixed(2));
        $("#total").html("$" + (totalCost + 35).toFixed(2));
      });

      tr = document.createElement("tr");
      tr.innerHTML += `
                <td>   </td>
                <td>   </td>
                <td>
                    <h5>Subtotal</h5>
                </td>
                <td class="text-right">
                    <h5><strong id="subTotal">$0.00</strong></h5>
                </td>
            `;
      productsDiv.append(tr);
      tr = document.createElement("tr");
      tr.innerHTML += `
                <td>   </td>
                <td>   </td>
                <td>
                    <h5>Estimated shipping</h5>
                </td>
                <td class="text-right">
                    <h5><strong>$35.00</strong></h5>
                </td>
`;
      productsDiv.append(tr);
      tr = document.createElement("tr");
      tr.innerHTML += `
                <td>   </td>
                <td>   </td>
                <td>
                    <h3>Total</h3>
                </td>
                <td class="text-right">
                    <h3><strong id="total">$35.00</strong></h3>
                </td>
    `;
      productsDiv.append(tr);
    });

  $("#btnFinish").click(() => {
    val = [];
    names = [];
    namesIds = [];
    $('[id^="item"][id$="val"]').each((_, el) => {
      val.push(Number.parseInt(el.value));
    });
    $('[id^="item"][id$="name"]').each((_, el) => {
      names.push(el.innerHTML);
      namesIds.push(el.id);
    });
    const total = Number.parseFloat($("#total").html().substr(1, 100000));

    let orderItems = [];
    for (let i = 0; i < val.length; i++) {
      if (val[i] > 0) {
        orderItems.push({
          name: names[i],
          quantity: val[i],
          productId: Number.parseInt(
            namesIds[i].substr(4, namesIds[i].indexOf("name") - 4)
          ),
        });
      }
    }

    let request = {
      name: $("#fullName").val(),
      address:
        $("#address").val() +
        ", " +
        $("#city").val() +
        ", " +
        $("#country").val(),
      totalValue: total,
      orderItems,
    };

    fetch("http://api.medicarehardware.tk/order", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      alert("Your order has been placed! Thank you for shopping with us!");
      window.location.href = "https://google.com";
    });
  });
});
