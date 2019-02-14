function bestCharge(selectedItems) {
  let array_key = [];
  let countItem = [];
  let allItems = loadAllItems();
  let promotions = loadPromotions();
  let summation = 0;
  let difference = [];
  let halfPrice = [];

  selectedItems.forEach(item => {
    array_key.push(item.split("x"))
  })
  array_key.forEach(data => {
    data[0] = data[0].trim();
    data[1] = data[1].trim();
  })
  array_key.forEach(data => {
    if (!countItem.find(element => element.id === data[0])) {
      countItem.push({id: data[0], count: data[1], name: '', price: 0.00, subtotal: 0.00})
    }
  })
  countItem.forEach(item => {
    allItems.forEach(data => {
      if (item.id === data.id) {
        item.name = data.name;
        item.price = data.price;
        item.subtotal = (item.price) * item.count;
      }
    })
  })

  countItem.forEach(data => {
    summation += data.subtotal
  })

  if (summation >= 30) {
    difference.push({m_price: parseInt(summation / 30) * 6, m_name: promotions[0].type});
  }
  let num = 0;
  let promotionsItem = [];
  let promotionsPrice = 0;
  let name = [];
  promotions[1].items.forEach(item => {
    countItem.forEach(data => {
      if (item == data.id) {
        num++;
        promotionsItem.push(data.count)
        promotionsPrice += data.price;
        name.push(data.name)
      }
    })
  })

  if (num == 2) {
    promotionsItem.sort((a, b) => a - b)
    halfPrice.push({
      m_price: promotionsPrice * promotionsItem[0] / 2,
      m_name: promotions[1].type + `(` + name[0] + `，` + name[1] + `)`
    });
  }
  maximumDiscount = (difference > halfPrice ? difference : halfPrice);

  return expected(countItem,maximumDiscount,summation)
}

function expected(countItem, maximumDiscount, summation) {
  let expectedString = "";

  expectedString += `============= 订餐明细 =============\n`;
  countItem.forEach(item => {
    expectedString += item.name + ` x ` + item.count + ` = ` + item.subtotal + `元\n`
  })
  expectedString += `-----------------------------------\n`;
  if (maximumDiscount.length !== 0) {
    expectedString += `使用优惠:
` + maximumDiscount[0].m_name + `，省` + maximumDiscount[0].m_price + `元
-----------------------------------
总计：` + (summation - maximumDiscount[0].m_price) + `元
===================================`.trim();
  }else{
    expectedString += `总计：` + (summation) + `元
===================================`.trim();
  }

  return expectedString
}
