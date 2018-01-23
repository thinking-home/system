<span class="th-cron-value">{{#isnull month}}*{{else}}{{month}}{{/isnull}}</span>:
<span class="th-cron-value">{{#isnull day}}*{{else}}{{day}}{{/isnull}}</span>:
<span class="th-cron-value">{{#isnull hour}}*{{else}}{{hour}}{{/isnull}}</span>:
<span class="th-cron-value">{{#isnull minute}}*{{else}}{{pad minute 2}}{{/isnull}}</span>
<a href="#" class="js-task-edit">{{name}}</a> {{#unless enabled}}{{lang 'disabled'}}{{/unless}}
