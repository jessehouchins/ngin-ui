<!-- Demo files -->
<link rel="stylesheet" type="text/css" href="css/demo.css" />
<script type="text/javascript" src="js/demo.js"></script>
<!-- Plugin files -->
<link rel="stylesheet" type="text/css" href="css/ngin-select.css" />
<script type="text/javascript" src="js/ngin-select.js"></script>


<h1>Ngin UI</h1>
<blockquote>This will house a collection of ui widgets designed to make form data entry more intuitive and efficient.</blockquote>
<hr>
<h2>Ngin Select
<p>Ngin Select <b>enhances select elements with a type-ahead style textfield</b> that will suggest the 
closest match to the user-entered text. Match relevance is based on position of the entered text 
relative to the start of a word and the start of the phrase. Use the up and down arrows to navigate 
relevant matches</p>
<dl>
<dt>Given the list</dt>
<dd>John Anderson, Al Johanson, Randy Jones</dd>

<dt>Match order for "jo"</dt>
<dd><b>Jo</b>hn Anderson, Al <b>Jo</b>hanson, Randy <b>Jo</b>nes</dd>

<dt>Match order for "an"</dt>
<dd>John <b>An</b>derson, R<b>an</b>dy Jones, Al Joh<b>an</b>son</dd>
</dl>

<p>Ngin Select also <b>uses standard HTML inputs</b> to match the style of your other UI elements without (much) additional CSS. The css included with the plugin is simply an override for your existing styles and can be used as is in most cases.</p>

<dl>
<dt>Standard inputs</dt>
<dd><input type="text" value="Basic textfield"/> <button>Button</button></dd>

<dt>Plus a standard select</dt>
<dd><script type="text/javascript"> demoSelect('demo0') </script></dd>

<dt>Equals less CSS</dt>
<dd><script type="text/javascript"> demoSelect('demo1').NginSelect() </script></dd>
</dl>