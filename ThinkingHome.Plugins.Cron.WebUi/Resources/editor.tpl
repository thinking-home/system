<h1>Cron task</h1>
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
                Day
            </label>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <select id="e4c3cb8a-cb69-4b42-8927-e92175e5d943" name="day" class="form-control">
                        <option value="">Every day</option>
                        {{#range 1 31 1}}
                        <option value="{{this}}">{{this}}</option>
                        {{/range}}
                    </select>
                </li>
                <li class="list-inline-item">
                    <select name="month" class="form-control">
                        <option value="">Every month</option>
                        <option value="1">Jan</option>
                        <option value="2">Feb</option>
                        <option value="3">Mar</option>
                        <option value="4">Apr</option>
                        <option value="5">May</option>
                        <option value="6">Jun</option>
                        <option value="7">Jul</option>
                        <option value="8">Aug</option>
                        <option value="9">Sep</option>
                        <option value="10">Oct</option>
                        <option value="11">Nov</option>
                        <option value="12">Dec</option>
                    </select>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <label for="06c5ae23-1b7d-4095-9b79-ff52ba3defdf">
                Time
            </label>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <select id="06c5ae23-1b7d-4095-9b79-ff52ba3defdf" name="hour" class="form-control">
                        <option value="">All</option>
                        {{#range 0 23 1}}
                        <option value="{{this}}">{{pad this 2}}</option>
                        {{/range}}
                    </select>
                </li>
                <li class="list-inline-item">:</li>
                <li class="list-inline-item">
                    <select name="minute" class="form-control">
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
        <div class="form-check">
            <label class="form-check-label">
                <input name="enabled" type="checkbox" class="form-check-input" />
                Enabled
            </label>
        </div>
        <p>
            <a href="#" class="btn btn-primary js-btn-save">Save</a>&nbsp;
            <a href="#" class="btn btn-secondary js-btn-cancel">Cancel</a>
            <a href="#" class="btn btn-danger pull-right js-btn-delete">Delete</a>
        </p>
    </div>
</form>
