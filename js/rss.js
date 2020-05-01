var container = document.getElementById("retainable-rss-embed");
if (container) {
    var css = document.createElement('link');
    css.href = "http://www.wollstonecraft.com/css/rss.css";
    css.rel = "stylesheet"
    document.getElementsByTagName('head')[0].appendChild(css);
    var script = document.createElement('script');
    script.src = "http://www.wollstonecraft.com/js/rss.js";
    document.getElementsByTagName('body')[0].appendChild(script);
}