$(function () {
  let searchParams = new URLSearchParams(window.location.search);
  let page = "home";
  if (searchParams.has("page") && searchParams.get("page").length > 0) {
    page = searchParams.get("page");
    $("#content").load(`src/core/${page}/index.html`);
  } else {
    $("#content").load(`src/core/${page}/index.html`);
  }
  $(`#${page}`).addClass("active");
});
