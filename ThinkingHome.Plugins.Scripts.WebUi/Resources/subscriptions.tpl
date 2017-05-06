<h1>Event handlers</h1>
<div class="row">
    <div class="col-md-3">
        <form>
            <div class="form-group">
                <label>Event alias</label>
                <select class="form-control js-event-list"></select>
            </div>
            <div class="form-group">
                <label>Script</label>
                <select class="form-control js-script-list"></select>
            </div>
            <input type="button" class="btn btn-primary js-btn-add-subscription" value="Add subscription"/>
        </form>
    </div>
    <div class="col-md-8">
        <table class="table">
            <thead class="thead-default">
                <tr>
                    <th>Event</th>
                    <th>Script</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="js-subscriptions-list"></tbody>
        </table>
    </div>
</div>
