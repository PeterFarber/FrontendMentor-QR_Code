$(function () {
  var data = "src/core/expenses-chart/data.json";
  $.getJSON(data, {
    format: "json",
  }).done(function (data) {
    let max_value = 0;
    $.each(data, function (i, item) {
      if (item.amount > max_value) {
        max_value = item.amount;
      }
    });

    $.each(data, function (i, item) {
      let percent = Math.round((item.amount / (max_value + 40)) * 100);
      let variant;
      if (max_value == item.amount) {
        variant = "cyan";
      }
      $("#chart").append(
        `<div class="col"><div class="value">$${item.amount}</div><div class="bar ${variant}" style="flex-basis: calc(${percent}%);"></div><h3>${item.day}</h3></div>`
      );
    });
  });
});
