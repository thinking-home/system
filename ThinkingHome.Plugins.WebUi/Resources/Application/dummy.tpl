<h1>Dummy page</h1>

<p>
    This is a dummy page. You can see this page because it is specified in the WebUiPlugin plugin settings.
    Change it's path in the <code>appsettings.json</code> file to another more useful path.
</p>

<pre><code>
{
    "plugins": {
        ...
        "ThinkingHome.Plugins.WebUi.WebUiPlugin": {
            "pages": {
                "welcome": "/webapp/dummy.js",
                "apps": "/webapp/dummy.js",
                "settings": "/webapp/dummy.js"
            }
        }
    }
    ...
}
</code></pre>
