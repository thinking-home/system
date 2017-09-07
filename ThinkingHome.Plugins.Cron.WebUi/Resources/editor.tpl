<h1>Task parameters</h1>
<form class="row">
    <div class="col-md-5">
        <div class="form-group">
            <label for="48e2eeb7-8823-4bd7-a321-41cfcb2e7bd6">
                Name
            </label>
            <input id="48e2eeb7-8823-4bd7-a321-41cfcb2e7bd6" name="name" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="e4c3cb8a-cb69-4b42-8927-e92175e5d943">
                Time
            </label>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <select id="e4c3cb8a-cb69-4b42-8927-e92175e5d943" name="hours" class="form-control">
                        <option value="">All</option>
                        {{#range 0 23 1}}
                        <option value="{{this}}">{{pad this 2}}</option>
                        {{/range}}
                    </select>
                </li>
                <li class="list-inline-item">:</li>
                <li class="list-inline-item">
                    <select name="minutes" class="form-control">
                        <option value="">All</option>
                        {{#range 0 59 1}}
                        <option value="{{this}}">{{pad this 2}}</option>
                        {{/range}}
                    </select>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <label for="908b0027-3b51-42df-b173-2b1dd554b53d">
                Event alias
            </label>
            <input id="908b0027-3b51-42df-b173-2b1dd554b53d" name="eventAlias" class="form-control"/>
        </div>
        <p>
            <a href="#" class="btn btn-primary js-btn-save">Save</a>&nbsp;
            <a href="#" class="btn btn-secondary js-btn-cancel">Cancel</a>
            <a href="#" class="btn btn-danger pull-right js-btn-delete">Delete</a>
        </p>
    </div>
</form>
