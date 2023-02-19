let step = 1;

let form_vals = {
  name: "",
  email: "",
  phone: "",
  plan: { name: "Arcade", cost: 9 },
  billing: "Monthly",
  online_service: 0,
  larger_storage: 0,
  customizable_profile: 0,
};

let data;
$(function () {
  var data_file = "src/core/multi-step-form/data.json";
  $.getJSON(data_file, {
    format: "json",
  }).done(function (d) {
    data = d;
    load_sidebar();
    load_form_inputs();
    load_step();
  });

  $("#btn-right").click(function (event) {
    if (step < data.length) {
      step++;
      load_step();
    } else {
      $("#main").html(`
      <div class="thankyou">

      <img src="src/core/multi-step-form/assets/images/icon-thank-you.svg"/>
<h1>Thank you!</h1>
<p>Thanks for confirming your subscription! We hope you have fun
using our platform. If you ever need support, please feel free to email us
at support@loremgaming.com.</p>
</div>
    `);
    }
    $("#btn-left").removeClass("dnone");

    if (step == data.length) {
      event.target.innerHTML = "Complete";

      let total = 0;
      let ext = "mo";
      if (form_vals.billing == "Yearly") {
        ext = "yr";
      }
      let cost = form_vals.plan.cost;
      if (form_vals.billing !== "Monthly") {
        cost = form_vals.plan.cost * 10;
      }
      total += cost;
      let html = `
      <div class="info">
        <div class="billing">
          <div class="data">
            <h3>${form_vals.plan.name} (${form_vals.billing})</h3>
            <a href="#" id="change">Change</a>
          </div>
          <div class="cost">$${cost}/${ext}</div>
        </div>
        <div class="services">
        `;
      if (form_vals.online_service !== 0) {
        let cost = form_vals.online_service;
        if (form_vals.billing !== "Monthly") {
          cost = form_vals.online_service * 10;
        }
        total += cost;

        html += `
          <div class="service">
            <h4>Online Service</h4>
            <h5>$${cost}/${ext}</h5>
          </div>
        `;
      }

      if (form_vals.larger_storage !== 0) {
        let cost = form_vals.larger_storage;
        if (form_vals.billing !== "Monthly") {
          cost = form_vals.larger_storage * 10;
        }
        total += cost;

        html += `
          <div class="service">
            <h4>Larger Service</h4>
            <h5>$${cost}/${ext}</h5>
          </div>
        `;
      }

      if (form_vals.customizable_profile !== 0) {
        let cost = `${form_vals.customizable_profile}`;
        if (form_vals.billing !== "Monthly") {
          cost = `${form_vals.customizable_profile * 10}`;
        }
        total += cost;

        html += `
          <div class="service">
            <h4>Customizable Profile</h4>
            <h5>$${cost}/${ext}</h5>
          </div>
        `;
      }

      html += `
        </div>
      </div>
      <div class="total">
        <h4>Total (per month)</h4>
        <h5>$${total}/${ext}</h5>
      </div>
        `;
      $(`#fstep4`).html(html);
      $(`#change`).click(function (event) {
        step = 2;
        load_step();
      });
    }
  });

  $("#btn-left").addClass("dnone");
  $("#btn-left").click(function (event) {
    if (step > 1) {
      step--;
      load_step();
    }
    if (step == 1) {
      $("#btn-left").addClass("dnone");
    }
    $("#btn-right").html("Next Step");
  });
});

function load_sidebar() {
  $.each(data, function (i, item) {
    let sidebar_step = `
    <li id='step${i}'>
      <div class="num">${i + 1}</div>
      <div class="info">
        <h2>Step ${i}</h2>
        <h3>${item.label}</h3>
      </div>
    </li>
    `;
    $("#sidebar").append(sidebar_step);
  });
}

function load_step() {
  for (var i = 0; i < data.length; i++) {
    $(`#step${i}`).removeClass("active");
  }
  $(`#step${step - 1}`).addClass("active");

  $("#header").html(data[step - 1].header);
  $("#subheader").html(data[step - 1].subheader);
  for (var i = 1; i <= data.length; i++) {
    $(`#fstep${i}`).addClass("dnone");
  }
  $(`#fstep${step}`).removeClass("dnone");

  let id = `fstep${step}`;

  $(`#${id}`).html("");

  $.each(data[step - 1].form, function (i, input) {
    switch (input.type) {
      case "text":
        create_text_input(input, id);
        $(`#${input.id}`).change(function (event) {
          update_input(event, input);
        });
        $(`#${input.id}`).blur(function (event) {
          update_input(event, input);
        });

        break;
      case "radio":
        create_radio_input(input, id);
        $(`#${input.value}`).click(function (event) {
          form_vals[input.id] = {
            name: event.target.value,
            cost: input.cost,
          };
          console.log(form_vals);
        });
        break;
      case "switch":
        create_switch_input(input, id);
        form_vals[input.id] = input.subLabel;
        $(`#${input.id}`).click(function (event) {
          if (event.target.checked) {
            form_vals[input.id] = input.subLabel;
          } else {
            form_vals[input.id] = input.label;
          }
          load_step();
        });
        break;
      case "checkbox":
        create_checkbox_input(input, id);
        $(`#${input.id}`).click(function (event) {
          if (event.target.checked) {
            form_vals[input.id] = input.cost;
          } else {
            form_vals[input.id] = "";
          }
          console.log(form_vals);
        });
        break;
    }
  });

  console.log(form_vals);
}

function load_btns() {}

function load_form_inputs() {
  $.each(data, function (i, step) {
    let id = `fstep${i + 1}`;
    $("#form").append(`<div class="dnone" id="${id}"></div>`);

    // $.each(step.form, function (i, input) {
    //   step = i + 1;
    //   load_step();
    // });

    if (i == 1) {
      $(`#${id}`).addClass("plans");
    }
    if (i == 3) {
      $(`#${id}`).addClass("summary");
    }
  });
}

function update_input(event, input) {
  if (event.target.value.length == 0 && input.required) {
    $(`#field_${input.id}`).addClass("error");
  } else {
    $(`#field_${input.id}`).removeClass("error");
  }
  form_vals[input.label] = event.target.value;
}

function create_switch_input(input, id) {
  let form_input = `
  <div class="switch">
    <input id="${input.id}" type="checkbox" />
    <label for="${input.id}"><span></span></label>
    <span>${input.label}</span>
    <span>${input.subLabel}</span>
  </div>
  `;

  $(`#${id}`).append(form_input);

  if (form_vals.billing == "Yearly") {
    $(`#${input.id}`).prop("checked", true);
  }
}

function create_checkbox_input(input, id) {
  let cost = `$${input.cost}/mo`;
  if (form_vals.billing !== "Monthly") {
    cost = `$${input.cost * 10}/yr`;
  }
  let form_input = `
  <div class="checkbox">
    <input id="${input.id}" type="checkbox" />
    <label for="${input.id}">
      <span></span>
      <div>
        <h3>${input.label}</h3>
        <h4>${input.subLabel}</h4>
      </div>
      <h5>${cost}</h5>

    </label>

  </div>
  `;

  $(`#${id}`).append(form_input);
  if (form_vals[input.id] != "") {
    $(`#${input.id}`).prop("checked", true);
  }
}

function create_radio_input(input, id) {
  let cost = `$${input.cost}/mo`;
  if (form_vals.billing !== "Monthly") {
    cost = `$${input.cost * 10}/yr`;
  }
  let form_input = `
  <div class="radio_field">
    <input id="${input.value}" type="radio" name="${input.id}" value="${input.label}"  />
    <label for="${input.value}">
      <img src="src/core/multi-step-form/assets/images/icon-${input.value}.svg" />
      <h3>${input.label}</h3>
      <p>${cost}</p>
    </label>
  </div>`;
  $(`#${id}`).append(form_input);
  if (form_vals[input.id].name == input.label) {
    $(`#${input.value}`).prop("checked", true);
  }
}

function create_text_input(input, id) {
  let form_input = `
        <div id="field_${input.id}" class="field">
        <label>${input.label}</label>
        <input id="${input.id}" type="${input.type}" placeholder="${input.placeholder}"/>
        </div>
        `;

  $(`#${id}`).append(form_input);
}
