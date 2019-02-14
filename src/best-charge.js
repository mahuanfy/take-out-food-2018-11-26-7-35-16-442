function bestCharge(selectedItems) {
  let num = 0;
  let promotionsItem = [];
  let promotionsPrice = 0;
  let name = [];
  let countItem = statisticalGoods(selectedItems)
  let promotions = loadPromotions();
  let summation = summationFunction(countItem);
  let difference = differenceFunction(summation, promotions);

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
  let halfPrice = halfPriceFunction(promotionsItem, num, promotionsPrice, promotions, name);
  let maximumDiscount = (difference[0].m_price > halfPrice[0].m_price ? difference : halfPrice);
  let expectedResult = expected(countItem, maximumDiscount, summation);

  return expectedResult
}


function statisticalGoods(selectedItems,) {
  let array_key = [];
  let countItem = [];

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
  return statisticalCommodityMachine(countItem);
}

function statisticalCommodityMachine(countItem) {
  let allItems = loadAllItems();

  countItem.forEach(item => {
    allItems.forEach(data => {
      if (item.id === data.id) {
        item.name = data.name;
        item.price = data.price;
        item.subtotal = (item.price) * item.count;
      }
    })
  })

  return countItem
}

function summationFunction(countItem) {
  let summation = 0;
  countItem.forEach(data => {
    summation += data.subtotal
  })
  return summation;
}
function differenceFunction(summation, promotions) {
  let difference = [];
  if (summation >= 30) {
    difference.push({m_price: parseInt(summation / 30) * 6, m_name: promotions[0].type});
  } else {
    difference.push({m_price: 0, m_name: 0});

  }
  return difference
}
function halfPriceFunction(promotionsItem, num, promotionsPrice, promotions, name) {
  let halfPrice = [];
  if (num == 2) {
    promotionsItem.sort((a, b) => a - b)
    halfPrice.push({
      m_price: promotionsPrice * promotionsItem[0] / 2,
      m_name: promotions[1].type + `(` + name[0] + `，` + name[1] + `)`
    });
  } else {
    halfPrice.push({
      m_price: 0,
      m_name: 0
    });
  }
  return halfPrice;
}
function expected(countItem, maximumDiscount, summation) {
  let expectedString = "";

  expectedString += `============= 订餐明细 =============\n`;
  countItem.forEach(item => {
    expectedString += item.name + ` x ` + item.count + ` = ` + item.subtotal + `元\n`
  })
  expectedString += `-----------------------------------\n`;

  if (isShangFavorable(maximumDiscount)) {
    expectedString += `使用优惠:
` + maximumDiscount[0].m_name + `，省` + maximumDiscount[0].m_price + `元
-----------------------------------
总计：` + (summation - maximumDiscount[0].m_price) + `元
===================================`.trim();
  } else {
    expectedString += `总计：` + (summation) + `元
===================================`.trim();
  }

  return expectedString
}

function isShangFavorable(maximumDiscount) {

  return maximumDiscount[0].m_name !== 0;
}
