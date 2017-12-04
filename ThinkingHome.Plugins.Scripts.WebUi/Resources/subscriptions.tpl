<h1>{{lang 'Script events'}}</h1>
<div class="row">
    <div class="col-md-3">
        <form class="mb-3">
            <div class="form-group">
                <label>{{lang 'Event alias'}}</label>
                <input class="form-control js-event-alias" />
            </div>
            <div class="form-group">
                <label>{{lang 'Script'}}</label>
                <select class="form-control js-script-list"></select>
            </div>
            <input type="button" class="btn btn-primary js-btn-add-subscription" value="{{lang 'Add subscription'}}"/>
        </form>
    </div>
    <div class="col-md-8">
        <table class="table js-table-subscriptions">
            <thead class="thead-default">
                <tr>
                    <th>{{lang 'Event'}}</th>
                    <th>{{lang 'Script'}}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
