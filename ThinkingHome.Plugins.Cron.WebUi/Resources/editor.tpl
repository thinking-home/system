<h1>{{lang 'Cron task'}}</h1>
<form class="row">
    <div class="col-md-5">
        <div class="form-group">
            <label for="48e2eeb7-8823-4bd7-a321-41cfcb2e7bd6">
                {{lang 'Name'}}
            </label>
            <input id="48e2eeb7-8823-4bd7-a321-41cfcb2e7bd6" name="name" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="e4c3cb8a-cb69-4b42-8927-e92175e5d943">
                {{lang 'Day'}}
            </label>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <select id="e4c3cb8a-cb69-4b42-8927-e92175e5d943" name="day" class="form-control">
                        <option value="">{{lang 'Every day'}}</option>
                        {{#range 1 31 1}}
                        <option value="{{this}}">{{this}}</option>
                        {{/range}}
                    </select>
                </li>
                <li class="list-inline-item">
                    <select name="month" class="form-control">
                        <option value="">{{lang 'Every month'}}</option>
                        <option value="1">{{lang 'Jan'}}</option>
                        <option value="2">{{lang 'Feb'}}</option>
                        <option value="3">{{lang 'Mar'}}</option>
                        <option value="4">{{lang 'Apr'}}</option>
                        <option value="5">{{lang 'May'}}</option>
                        <option value="6">{{lang 'Jun'}}</option>
                        <option value="7">{{lang 'Jul'}}</option>
                        <option value="8">{{lang 'Aug'}}</option>
                        <option value="9">{{lang 'Sep'}}</option>
                        <option value="10">{{lang 'Oct'}}</option>
                        <option value="11">{{lang 'Nov'}}</option>
                        <option value="12">{{lang 'Dec'}}</option>
                    </select>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <label for="06c5ae23-1b7d-4095-9b79-ff52ba3defdf">
                {{lang 'Time'}}
            </label>
            <ul class="list-inline">
                <li class="list-inline-item">
                    <select id="06c5ae23-1b7d-4095-9b79-ff52ba3defdf" name="hour" class="form-control">
                        <option value="">{{lang 'All'}}</option>
                        {{#range 0 23 1}}
                        <option value="{{this}}">{{pad this 2}}</option>
                        {{/range}}
                    </select>
                </li>
                <li class="list-inline-item">:</li>
                <li class="list-inline-item">
                    <select name="minute" class="form-control">
                        <option value="">{{lang 'All'}}</option>
                        {{#range 0 59 1}}
                        <option value="{{this}}">{{pad this 2}}</option>
                        {{/range}}
                    </select>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <label for="908b0027-3b51-42df-b173-2b1dd554b53d">
                {{lang 'Event alias'}}
            </label>
            <input id="908b0027-3b51-42df-b173-2b1dd554b53d" name="eventAlias" class="form-control"/>
        </div>
        <div class="form-check">
            <label class="form-check-label">
                <input name="enabled" type="checkbox" class="form-check-input" />
                {{lang 'Enabled'}}
            </label>
        </div>
        <p>
            <a href="#" class="btn btn-primary js-btn-save">{{lang 'Save'}}</a>&nbsp;
            <a href="#" class="btn btn-secondary js-btn-cancel">{{lang 'Cancel'}}</a>
            <a href="#" class="btn btn-danger pull-right js-btn-delete">{{lang 'Delete'}}</a>
        </p>
    </div>
</form>
